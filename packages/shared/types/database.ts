export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account: {
        Row: {
          access_token: string | null
          access_token_expires_at: string | null
          account_id: string
          created_at: string
          id: string
          id_token: string | null
          password: string | null
          provider_id: string
          refresh_token: string | null
          refresh_token_expires_at: string | null
          scope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_expires_at?: string | null
          account_id: string
          created_at?: string
          id: string
          id_token?: string | null
          password?: string | null
          provider_id: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          scope?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_expires_at?: string | null
          account_id?: string
          created_at?: string
          id?: string
          id_token?: string | null
          password?: string | null
          provider_id?: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          scope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement: {
        Row: {
          description: string
          icon_url: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          description: string
          icon_url: string
          id?: never
          name: string
          user_id: string
        }
        Update: {
          description?: string
          icon_url?: string
          id?: never
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      "log-admin": {
        Row: {
          action: Database["public"]["Enums"]["log-admin-action"]
          data: Json | null
          id: number
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["log-admin-action"]
          data?: Json | null
          id?: never
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["log-admin-action"]
          data?: Json | null
          id?: never
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "log-admin_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      "log-user": {
        Row: {
          action: Database["public"]["Enums"]["log-user-action"]
          data: Json | null
          id: number
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["log-user-action"]
          data?: Json | null
          id?: never
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["log-user-action"]
          data?: Json | null
          id?: never
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "log-user_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      project: {
        Row: {
          code_url: string
          description: string
          id: number
          image_url: string
          name: string
          playable_url: string
          type: Database["public"]["Enums"]["project_type"]
          user_id: string
        }
        Insert: {
          code_url: string
          description: string
          id?: never
          image_url: string
          name: string
          playable_url: string
          type: Database["public"]["Enums"]["project_type"]
          user_id: string
        }
        Update: {
          code_url?: string
          description?: string
          id?: never
          image_url?: string
          name?: string
          playable_url?: string
          type?: Database["public"]["Enums"]["project_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      reviewer_approved_project: {
        Row: {
          comment: string | null
          id: number
          project_id: number
          "reviewer.id": number
          ship_justification: string
        }
        Insert: {
          comment?: string | null
          id: number
          project_id: number
          "reviewer.id": number
          ship_justification: string
        }
        Update: {
          comment?: string | null
          id?: number
          project_id?: number
          "reviewer.id"?: number
          ship_justification?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_approved_project_id_reviewer_project_id_fk"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "reviewer_project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_approved_project_project_id_project_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_approved_project_reviewer.id_user_account_id_fk"
            columns: ["reviewer.id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
        ]
      }
      reviewer_need_changes_project: {
        Row: {
          comment: string
          id: number
          permanent_rejection: boolean
          project_id: number
          "reviewer.id": number
        }
        Insert: {
          comment: string
          id: number
          permanent_rejection?: boolean
          project_id: number
          "reviewer.id": number
        }
        Update: {
          comment?: string
          id?: number
          permanent_rejection?: boolean
          project_id?: number
          "reviewer.id"?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_need_changes_project_id_reviewer_project_id_fk"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "reviewer_project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_need_changes_project_project_id_project_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_need_changes_project_reviewer.id_user_account_id_fk"
            columns: ["reviewer.id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
        ]
      }
      reviewer_project: {
        Row: {
          drafted: boolean
          drafted_at: string | null
          fraud_passed: boolean | null
          fraud_score: number
          id: number
          project_id: number
          reviewed_at: string | null
          "reviewer.id": number | null
          status: Database["public"]["Enums"]["review_status"]
        }
        Insert: {
          drafted?: boolean
          drafted_at?: string | null
          fraud_passed?: boolean | null
          fraud_score?: number
          id: number
          project_id: number
          reviewed_at?: string | null
          "reviewer.id"?: number | null
          status?: Database["public"]["Enums"]["review_status"]
        }
        Update: {
          drafted?: boolean
          drafted_at?: string | null
          fraud_passed?: boolean | null
          fraud_score?: number
          id?: number
          project_id?: number
          reviewed_at?: string | null
          "reviewer.id"?: number | null
          status?: Database["public"]["Enums"]["review_status"]
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_project_id_shipped_project_id_fk"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "shipped_project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_project_project_id_project_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_project_reviewer.id_user_account_id_fk"
            columns: ["reviewer.id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
        ]
      }
      reviewer_project_note: {
        Row: {
          created_at: string
          id: number
          note: string
          project_id: number
          reviewer_id: number
          updated_at: string
        }
        Insert: {
          created_at: string
          id: number
          note: string
          project_id: number
          reviewer_id: number
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          note?: string
          project_id?: number
          reviewer_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_project_note_id_project_id_fk"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_project_note_project_id_project_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_project_note_reviewer_id_user_account_id_fk"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
        ]
      }
      reviewer_user_note: {
        Row: {
          created_at: string
          id: number
          note: string
          reviewer_id: number
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at: string
          id?: never
          note: string
          reviewer_id: number
          updated_at: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: never
          note?: string
          reviewer_id?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_user_note_reviewer_id_user_account_id_fk"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviewer_user_note_user_id_user_account_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_account"
            referencedColumns: ["id"]
          },
        ]
      }
      session: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id: string
          ip_address?: string | null
          token: string
          updated_at: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      shipped_project: {
        Row: {
          comment: string | null
          id: number
          project_id: number
          shipped_at: string
          status: Database["public"]["Enums"]["shipped_project_status"]
        }
        Insert: {
          comment?: string | null
          id?: never
          project_id: number
          shipped_at: string
          status?: Database["public"]["Enums"]["shipped_project_status"]
        }
        Update: {
          comment?: string | null
          id?: never
          project_id?: number
          shipped_at?: string
          status?: Database["public"]["Enums"]["shipped_project_status"]
        }
        Relationships: [
          {
            foreignKeyName: "shipped_project_project_id_project_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      shom_item: {
        Row: {
          added_by: string
          category: Database["public"]["Enums"]["shop_item_category"]
          cost: number[]
          description: string
          id: number
          name: string
        }
        Insert: {
          added_by: string
          category: Database["public"]["Enums"]["shop_item_category"]
          cost: number[]
          description: string
          id?: never
          name: string
        }
        Update: {
          added_by?: string
          category?: Database["public"]["Enums"]["shop_item_category"]
          cost?: number[]
          description?: string
          id?: never
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "shom_item_added_by_user_id_fk"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean
          encrypted_name: string
          id: string
          image: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean
          encrypted_name: string
          id: string
          image?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean
          encrypted_name?: string
          id?: string
          image?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_account: {
        Row: {
          created_at: string
          id: number
          role: Database["public"]["Enums"]["user_permissions"][] | null
          shards: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          id?: never
          role?: Database["public"]["Enums"]["user_permissions"][] | null
          shards?: number
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          role?: Database["public"]["Enums"]["user_permissions"][] | null
          shards?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_account_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      verification: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          identifier: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id: string
          identifier: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          identifier?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_id: { Args: never; Returns: string }
      set_user_id: { Args: { user_id: string }; Returns: undefined }
    }
    Enums: {
      "log-admin-action":
        | "add-permissions"
        | "modify-permissions"
        | "remove-permissions"
        | "add-event"
        | "modify-event"
        | "remove-event"
        | "add-shop-item"
        | "modify-shop-item"
        | "remove-shop-item"
      "log-user-action":
        | "user-create"
        | "user-edit"
        | "project-draft"
        | "project-delete"
        | "project-ship"
      project_type:
        | "software-web"
        | "software-mobile"
        | "software-windows"
        | "software-mac"
        | "software-linux"
        | "software-cross"
        | "hardware"
      review_status:
        | "pending"
        | "on-review"
        | "on-review-drafted"
        | "silently-rejected"
        | "changes-needed"
        | "approved"
      shipped_project_status:
        | "shipped"
        | "reviewed"
        | "changes-needed"
        | "permanently-rejected"
        | "approved"
      shop_item_category: "grant" | "items"
      user_permissions: "member" | "reviewer" | "fulfillment" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      "log-admin-action": [
        "add-permissions",
        "modify-permissions",
        "remove-permissions",
        "add-event",
        "modify-event",
        "remove-event",
        "add-shop-item",
        "modify-shop-item",
        "remove-shop-item",
      ],
      "log-user-action": [
        "user-create",
        "user-edit",
        "project-draft",
        "project-delete",
        "project-ship",
      ],
      project_type: [
        "software-web",
        "software-mobile",
        "software-windows",
        "software-mac",
        "software-linux",
        "software-cross",
        "hardware",
      ],
      review_status: [
        "pending",
        "on-review",
        "on-review-drafted",
        "silently-rejected",
        "changes-needed",
        "approved",
      ],
      shipped_project_status: [
        "shipped",
        "reviewed",
        "changes-needed",
        "permanently-rejected",
        "approved",
      ],
      shop_item_category: ["grant", "items"],
      user_permissions: ["member", "reviewer", "fulfillment", "admin"],
    },
  },
} as const
