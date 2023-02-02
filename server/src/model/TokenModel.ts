export {};
import mongoose, { Schema } from "mongoose";

interface IToken {
  userId: Schema.Types.ObjectId;
  refreshToken: string;
  requestedTime: Date;
}

export const TokenSchema = new Schema<IToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, default: "" },
  requestedTime: { type: Date, default: Date.now },
});

const Token = mongoose.model<IToken>("Token", TokenSchema);

export default Token;
