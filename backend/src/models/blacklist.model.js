import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: [true, "Token is required to add to the blacklist."] },
  },
  {
    timestamps: true,
  }
);

const BlacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema);

export default BlacklistToken;