module Aptos::Database {
    use std::signer;
    use std::vector;
    use std::string;
    use std::hash;
    use std::option;

    struct User has key, store {
        name: vector<u8>,
        friend_list: vector<Friend>,
    }

    struct Friend has copy, drop, store {
        pubkey: address,
        name: vector<u8>,
    }

    struct Message has copy, drop, store {
        sender: address,
        timestamp: u64,
        msg: vector<u8>,
    }

    struct ChatDatabase has key {
        user_list: vector<User>,
        all_messages: table<vector<u8>, vector<Message>>,
    }

    public fun init(account: &signer) {
        let chat_database = ChatDatabase {
            user_list: vector::empty<User>(),
            all_messages: table::new<vector<u8>, vector<Message>>(),
        };
        move_to(account, chat_database);
    }

    public fun check_user_exists(account: &signer, pubkey: address): bool {
        let chat_database = borrow_global<ChatDatabase>(signer::address_of(account));
        exists_user(pubkey, &chat_database.user_list)
    }

    public fun create_account(account: &signer, name: vector<u8>) {
        let pubkey = signer::address_of(account);
        assert!(!check_user_exists(account, pubkey), 1);
        assert!(vector::length(&name) > 0, 2);
        
        let chat_database = borrow_global_mut<ChatDatabase>(pubkey);
        let new_user = User {
            name: name,
            friend_list: vector::empty<Friend>(),
        };
        vector::push_back(&mut chat_database.user_list, new_user);
    }

    public fun get_username(account: &signer, pubkey: address): vector<u8> {
        assert!(check_user_exists(account, pubkey), 3);
        
        let chat_database = borrow_global<ChatDatabase>(signer::address_of(account));
        get_user_name(pubkey, &chat_database.user_list)
    }

    public fun add_friend(account: &signer, friend_key: address, name: vector<u8>) {
        let pubkey = signer::address_of(account);
        assert!(check_user_exists(account, pubkey), 1);
        assert!(check_user_exists(account, friend_key), 4);
        assert!(pubkey != friend_key, 5);
        assert!(!check_already_friends(pubkey, friend_key), 6);

        _add_friend(pubkey, friend_key, name);
        _add_friend(friend_key, pubkey, get_user_name(pubkey));
    }

    public fun get_my_friend_list(account: &signer): vector<Friend> {
        let pubkey = signer::address_of(account);
        let chat_database = borrow_global<ChatDatabase>(pubkey);
        get_friend_list(pubkey, &chat_database.user_list)
    }

    public fun send_message(account: &signer, friend_key: address, msg: vector<u8>) {
        let pubkey = signer::address_of(account);
        assert!(check_user_exists(account, pubkey), 1);
        assert!(check_user_exists(account, friend_key), 4);
        assert!(check_already_friends(pubkey, friend_key), 7);

        let chat_code = get_chat_code(pubkey, friend_key);
        let new_msg = Message {
            sender: pubkey,
            timestamp: std::timestamp::now_seconds(),
            msg: msg,
        };

        let chat_database = borrow_global_mut<ChatDatabase>(pubkey);
        let messages = table::borrow_mut(&mut chat_database.all_messages, chat_code);
        vector::push_back(messages, new_msg);
    }

    public fun read_message(account: &signer, friend_key: address): vector<Message> {
        let chat_code = get_chat_code(signer::address_of(account), friend_key);
        let chat_database = borrow_global<ChatDatabase>(signer::address_of(account));
        table::borrow(&chat_database.all_messages, chat_code)
    }

    fun exists_user(pubkey: address, user_list: &vector<User>): bool {
        vector::any(user_list, fun (user: &User): bool {
            user.pubkey == pubkey
        })
    }

    fun get_user_name(pubkey: address, user_list: &vector<User>): vector<u8> {
        vector::find(user_list, fun (user: &User): bool {
            user.pubkey == pubkey
        }).name
    }

    fun get_friend_list(pubkey: address, user_list: &vector<User>): vector<Friend> {
        vector::find(user_list, fun (user: &User): bool {
            user.pubkey == pubkey
        }).friend_list
    }

    fun check_already_friends(pubkey1: address, pubkey2: address): bool {
        // Implement similar to Solidity version if required
    }

    fun _add_friend(me: address, friend_key: address, name: vector<u8>) {
        // Implement similar to Solidity version if required
    }

    fun get_chat_code(pubkey1: address, pubkey2: address): vector<u8> {
        if (pubkey1 < pubkey2) {
            hash::sha3_256(pubkey1.concat(pubkey2))
        } else {
            hash::sha3_256(pubkey2.concat(pubkey1))
        }
    }
}
