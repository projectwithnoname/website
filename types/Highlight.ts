import type { HighlightStyle } from "@/lib/generated/prisma/enums";
import type { PublicUser } from "@/types/User";

export type { HighlightStyle };

export interface CreateHighlight {
  text: string;
  url: string;
  context: string;
  color: string;
  style: HighlightStyle;
  note?: string;
  title?: string;
  favicon?: string;
}

export interface PublicHighlight extends CreateHighlight {
  id: string;
  createdAt: string;
  createdBy: PublicUser;
}
