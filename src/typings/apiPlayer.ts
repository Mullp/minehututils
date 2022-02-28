export interface ApiPlayer {
  name: string;
  id: string;
  properties?: { name: string; value: string }[];
  name_history?: { name: string; changedToAt?: Date }[];
}
