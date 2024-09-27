```mermaid
erDiagram

  "users" {
    String id "🗝️"
    String name 
    String email "❓"
    String password "❓"
    DateTime email_verified "❓"
    String image "❓"
    DateTime createdAt 
    DateTime updatedAt 
    }
  

  "accounts" {
    String id "🗝️"
    String user_id 
    String type "❓"
    String provider 
    String provider_account_id 
    String token_type "❓"
    String refresh_token "❓"
    String access_token "❓"
    Int expires_at "❓"
    String scope "❓"
    String id_token "❓"
    DateTime createdAt 
    DateTime updatedAt 
    }
  

  "sessions" {
    String id "🗝️"
    String user_id "❓"
    String session_token 
    String access_token "❓"
    DateTime expires 
    DateTime createdAt 
    DateTime updatedAt 
    }
  

  "verification_requests" {
    String id "🗝️"
    String identifier 
    String token 
    DateTime expires 
    DateTime createdAt 
    DateTime updatedAt 
    }
  

  "rooms" {
    String id "🗝️"
    String name 
    DateTime createdAt 
    DateTime updatedAt 
    }
  

  "games" {
    String id "🗝️"
    String name "❓"
    String description "❓"
    DateTime createdAt 
    DateTime updatedAt 
    }
  

  "user_votes" {
    String id "🗝️"
    String vote 
    DateTime createdAt 
    DateTime updatedAt 
    }
  
    "users" o{--}o "accounts" : "accounts"
    "users" o{--}o "sessions" : "sessions"
    "users" o{--}o "rooms" : "roomsAuthored"
    "users" o{--}o "rooms" : "roomsJoined"
    "users" o{--}o "rooms" : "Room"
    "users" o{--}o "user_votes" : "UserVote"
    "accounts" o|--|| "users" : "user"
    "sessions" o|--|o "users" : "user"
    "rooms" o|--|| "users" : "author"
    "rooms" o{--}o "users" : "users"
    "rooms" o|--|o "users" : "User"
    "rooms" o{--}o "games" : "Game"
    "games" o|--|| "rooms" : "room"
    "games" o{--}o "user_votes" : "UserVote"
    "user_votes" o|--|| "users" : "user"
    "user_votes" o|--|| "games" : "game"
```
