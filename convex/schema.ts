import { defineSchema } from "convex/server";
import { tallies } from "./tally.schema";

const schema = defineSchema({
	tallies,
});

export default schema;
