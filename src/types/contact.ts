export interface ContactChannel {
  id: string; // Temporarily added for sortable
  type: string;
  label: string;
  value: string;
  icon: string;
  action: string;
}

export interface ContactData {
  title: string;
  description: string;
  channels: ContactChannel[];
  location: {
    showLocation: boolean;
    addressText: string;
    mapEmbedUrl: string;
  };
  titleStyle?: import("./style").ElementStyle;
  descriptionStyle?: import("./style").ElementStyle;
}
