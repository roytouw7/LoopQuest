export interface GameObjectAction {
  description: string;
  handler: keyof this;
}
