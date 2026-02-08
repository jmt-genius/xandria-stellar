#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Book {
    pub title: String,
    pub author: String,
    pub price: i128,
    pub cover_uri: String,
    pub book_uri: String,
    pub description: String, // Added description
    pub is_special: bool,
    pub total_supply: u32,
    pub remaining_supply: u32,
    pub author_address: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Tip {
    pub sender: Address,
    pub amount: i128,
    pub message: String,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Book(u32),
    TokenIdCounter,
    Purchase(Address, u32),
    Tips(u32), // Book ID -> Vec<Tip>
}

#[contract]
pub struct HelloWorldContract;

#[contractimpl]
impl HelloWorldContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn publish_book(
        env: Env,
        author: Address,
        title: String,
        author_name: String,
        description: String,
        price: i128,
        cover_uri: String,
        book_uri: String,
        is_special: bool,
        supply: u32,
    ) -> u32 {
        author.require_auth();

        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::TokenIdCounter)
            .unwrap_or(0);
        count += 1;

        let total_supply = if is_special { supply } else { u32::MAX };
        let remaining_supply = total_supply;

        let book = Book {
            title,
            author: author_name,
            price,
            cover_uri,
            book_uri,
            description,
            is_special,
            total_supply,
            remaining_supply,
            author_address: author,
        };

        env.storage()
            .instance()
            .set(&DataKey::TokenIdCounter, &count);
        env.storage().persistent().set(&DataKey::Book(count), &book);

        count
    }

    pub fn get_book(env: Env, book_id: u32) -> Option<Book> {
        env.storage().persistent().get(&DataKey::Book(book_id))
    }

    pub fn buy_book(env: Env, buyer: Address, book_id: u32, token_address: Address) {
        buyer.require_auth();

        let mut book: Book = env
            .storage()
            .persistent()
            .get(&DataKey::Book(book_id))
            .expect("Book not found");

        if book.remaining_supply == 0 {
            panic!("Book is sold out");
        }

        if buyer == book.author_address {
            panic!("Author cannot buy their own book");
        }

        if env
            .storage()
            .persistent()
            .has(&DataKey::Purchase(buyer.clone(), book_id))
        {
            panic!("You have already bought this book");
        }

        // Get admin address
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        // Calculate fee (10%)
        let fee = book.price / 10;
        let author_amount = book.price - fee;

        // Transfer funds
        let token = token::Client::new(&env, &token_address);

        // 10% to admin
        if fee > 0 {
            token.transfer(&buyer, &admin, &fee);
        }

        // Remainder to author
        if author_amount > 0 {
            token.transfer(&buyer, &book.author_address, &author_amount);
        }

        // Record purchase
        env.storage()
            .persistent()
            .set(&DataKey::Purchase(buyer, book_id), &true);

        // Update supply if special
        if book.is_special {
            book.remaining_supply -= 1;
            env.storage()
                .persistent()
                .set(&DataKey::Book(book_id), &book);
        }
    }

    pub fn has_purchased(env: Env, buyer: Address, book_id: u32) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Purchase(buyer, book_id))
    }

    pub fn tip_author(
        env: Env,
        sender: Address,
        book_id: u32,
        amount: i128,
        message: String,
        token_address: Address,
    ) {
        sender.require_auth();

        let book: Book = env
            .storage()
            .persistent()
            .get(&DataKey::Book(book_id))
            .expect("Book not found");

        if amount <= 0 {
            panic!("Tip amount must be positive");
        }

        let token = token::Client::new(&env, &token_address);
        token.transfer(&sender, &book.author_address, &amount);

        // Store the tip
        let mut tips: soroban_sdk::Vec<Tip> = env
            .storage()
            .persistent()
            .get(&DataKey::Tips(book_id))
            .unwrap_or(soroban_sdk::Vec::new(&env));

        tips.push_back(Tip {
            sender,
            amount,
            message,
            timestamp: env.ledger().timestamp(),
        });

        env.storage()
            .persistent()
            .set(&DataKey::Tips(book_id), &tips);
    }

    pub fn get_tips(env: Env, book_id: u32) -> soroban_sdk::Vec<Tip> {
        env.storage()
            .persistent()
            .get(&DataKey::Tips(book_id))
            .unwrap_or(soroban_sdk::Vec::new(&env))
    }
}

mod test;
