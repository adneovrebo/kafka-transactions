import { connect } from "mongoose";

connect(process.env.MONGO_DB_CONNECTION_STRING!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
