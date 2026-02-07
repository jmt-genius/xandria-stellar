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
    pub is_special: bool,
    pub total_supply: u32,
    pub remaining_supply: u32,
    pub author_address: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Book(u32),
    TokenIdCounter,
}

#[contract]
pub struct HelloWorldContract;

#[contractimpl]
impl HelloWorldContract {
    pub fn publish_book(
        env: Env,
        author: Address,
        title: String,
        author_name: String,
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

        // Transfer funds
        let token = token::Client::new(&env, &token_address);
        token.transfer(&buyer, &book.author_address, &book.price);

        // Update supply if special
        if book.is_special {
            book.remaining_supply -= 1;
            env.storage()
                .persistent()
                .set(&DataKey::Book(book_id), &book);
        }
    }
}

mod test;
