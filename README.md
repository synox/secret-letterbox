encrypted secret letterbox
=================

Client-Encrypted, Offline-First, Web diary or secret letterbox. 

       Browser (JS)
    +---------------+
    |  Plaintext    |
    |     +         |
    |     |         |
    | encrypt&save  |
    |     |         |                      Backend (PHP)
    |     v         |        Sync        +--------------------+
    | localStorage  | -----------------> | Save to directory  |
    +---------------+                    | (../data)          |
                                         +--------------------+

Goal: 
**Asymmetric encryption with minimal codebase** 

Features: 
 - PGP encryption in the Browser using [OpenPGP JS][1]
 - Offline WebApp with offline storage. 
 - Automatic synchronization with the backend. 
 - PHP-Backend has no dependencies and saves each message in a file. 
 - can be combined with https://github.com/synox/diary

## Disclaimer
You should update to the latest version of  [OpenPGP JS][1]. I can not validate the security of [OpenPGP JS][1], therefore I can not recommend it for production use. 

There is no spam protection nor any valiation. 


## Installation

 - read & understand the source code 
 - in `backend.php` change the $data_directory to something outside the `public_http` directory. 
 - learn to use gpg, then create new key: `gpg --gen-key`  
 - Export public key `gpg --armor --export  "my-key-name"`
 - Insert public key into `public_key.js` (some SublimeText magic might help)


## Useful scripts

Use the follwing script to download and delete the encrypted messages from the server.

    rsync --quiet --archive --update --times --whole-file --no-motd \
      --exclude=".keep" --include "*.gpg"  --remove-source-files \
      myserver.com:letterbox/data/ /home/steve/secrets/   \
      > /var/log/secret-letterbox-sync.log 2>&1

For development you can use the built-in php server: 

    php -S localhost:8000


[1]: https://github.com/openpgpjs/openpgpjs
