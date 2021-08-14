# Kafka transactions
## Cloud providers
- Atlas mongoDB
- Cloudkarafka

### Frameworks
API
-   Express

Consumers/Producers
- Kafkajs

DB
- Mongodb

## Run locally
```bash
# Create .env file with creds

# Install dependencies
npm i 

# Start local kafka with kafkadrop
cd kafka-dokcer && docker-compose up -d

# Run application
npm run dev # API exposed at localhost:3000
```

## Functinality
### API
/?amount=AMOUNT&username=USERNAME
-   Produce transaction event
-   Event is processed and added to transaction table. 
    - Event is stored
    - Version of transaction is stores

/transaction?user=USERNAME
- List active transactionstate on user

/transaction/events?user=USERNAME
- List all events connected to the transaction and user.

/transaction/versions?user=USERNAME
- List transactions with all versions


