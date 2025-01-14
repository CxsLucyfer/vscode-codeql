import { MethodSignature } from "./external-api-usage";

export type ModeledMethodType =
  | "none"
  | "source"
  | "sink"
  | "summary"
  | "neutral";

export type Provenance =
  // Generated by the dataflow model
  | "df-generated"
  // Generated by the dataflow model and manually edited
  | "df-manual"
  // Generated by the auto-model
  | "ai-generated"
  // Generated by the auto-model and manually edited
  | "ai-manual"
  // Entered by the user in the editor manually
  | "manual";

export interface ModeledMethod extends MethodSignature {
  type: ModeledMethodType;
  input: string;
  output: string;
  kind: string;
  provenance: Provenance;
}
