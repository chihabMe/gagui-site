import { SchemaTypeDefinition } from "sanity";
import { schemaTypes } from "./schemas";
import { subscriptionRequest } from "./schemas/subscription-request";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...schemaTypes, subscriptionRequest],
};
