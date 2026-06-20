export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      contacts: {
        Row: {
          consent_at: string | null;
          created_at: string;
          email: string;
          id: string;
          locale: string;
          marketing_consent: boolean;
          name: string | null;
          phone: string | null;
          source: string;
          status: Database["public"]["Enums"]["contact_status"];
          tags: string[];
          unsubscribed_at: string | null;
          updated_at: string;
        };
        Insert: {
          consent_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          locale?: string;
          marketing_consent?: boolean;
          name?: string | null;
          phone?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["contact_status"];
          tags?: string[];
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          consent_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          locale?: string;
          marketing_consent?: boolean;
          name?: string | null;
          phone?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["contact_status"];
          tags?: string[];
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_groups: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      contact_group_members: {
        Row: {
          contact_id: string;
          group_id: string;
        };
        Insert: {
          contact_id: string;
          group_id: string;
        };
        Update: {
          contact_id?: string;
          group_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_group_members_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "contact_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_segments: {
        Row: {
          created_at: string;
          definition: Json;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          definition?: Json;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          definition?: Json;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      email_campaigns: {
        Row: {
          audience_id: string | null;
          audience_kind: string;
          created_at: string;
          id: string;
          payload: Json;
          scheduled_at: string | null;
          sent_count: number;
          status: Database["public"]["Enums"]["campaign_status"];
          subject_override: string | null;
          template_key: string;
          updated_at: string;
        };
        Insert: {
          audience_id?: string | null;
          audience_kind: string;
          created_at?: string;
          id?: string;
          payload?: Json;
          scheduled_at?: string | null;
          sent_count?: number;
          status?: Database["public"]["Enums"]["campaign_status"];
          subject_override?: string | null;
          template_key: string;
          updated_at?: string;
        };
        Update: {
          audience_id?: string | null;
          audience_kind?: string;
          created_at?: string;
          id?: string;
          payload?: Json;
          scheduled_at?: string | null;
          sent_count?: number;
          status?: Database["public"]["Enums"]["campaign_status"];
          subject_override?: string | null;
          template_key?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_events: {
        Row: {
          event_type: string;
          id: string;
          message_id: string | null;
          occurred_at: string;
          payload: Json | null;
          provider_id: string | null;
        };
        Insert: {
          event_type: string;
          id?: string;
          message_id?: string | null;
          occurred_at?: string;
          payload?: Json | null;
          provider_id?: string | null;
        };
        Update: {
          event_type?: string;
          id?: string;
          message_id?: string | null;
          occurred_at?: string;
          payload?: Json | null;
          provider_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "email_events_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "email_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      email_messages: {
        Row: {
          campaign_id: string | null;
          category: Database["public"]["Enums"]["email_category"];
          created_at: string;
          error: string | null;
          id: string;
          idempotency_key: string | null;
          provider_id: string | null;
          status: Database["public"]["Enums"]["email_status"];
          subject: string;
          template_key: string;
          to_contact_id: string | null;
          to_email: string;
          updated_at: string;
        };
        Insert: {
          campaign_id?: string | null;
          category: Database["public"]["Enums"]["email_category"];
          created_at?: string;
          error?: string | null;
          id?: string;
          idempotency_key?: string | null;
          provider_id?: string | null;
          status?: Database["public"]["Enums"]["email_status"];
          subject: string;
          template_key: string;
          to_contact_id?: string | null;
          to_email: string;
          updated_at?: string;
        };
        Update: {
          campaign_id?: string | null;
          category?: Database["public"]["Enums"]["email_category"];
          created_at?: string;
          error?: string | null;
          id?: string;
          idempotency_key?: string | null;
          provider_id?: string | null;
          status?: Database["public"]["Enums"]["email_status"];
          subject?: string;
          template_key?: string;
          to_contact_id?: string | null;
          to_email?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "email_messages_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "email_campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "email_messages_to_contact_id_fkey";
            columns: ["to_contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      email_templates: {
        Row: {
          audience: Database["public"]["Enums"]["email_audience"];
          blocks: Json;
          category: Database["public"]["Enums"]["email_category"];
          created_at: string;
          id: string;
          is_active: boolean;
          key: string;
          name: string;
          preheader: string | null;
          subject: string;
          updated_at: string;
        };
        Insert: {
          audience: Database["public"]["Enums"]["email_audience"];
          blocks?: Json;
          category: Database["public"]["Enums"]["email_category"];
          created_at?: string;
          id?: string;
          is_active?: boolean;
          key: string;
          name: string;
          preheader?: string | null;
          subject: string;
          updated_at?: string;
        };
        Update: {
          audience?: Database["public"]["Enums"]["email_audience"];
          blocks?: Json;
          category?: Database["public"]["Enums"]["email_category"];
          created_at?: string;
          id?: string;
          is_active?: boolean;
          key?: string;
          name?: string;
          preheader?: string | null;
          subject?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_generation_runs: {
        Row: {
          created_at: string;
          error: string | null;
          id: string;
          image_model: string;
          model: string;
          post_id: string | null;
          schedule_id: string | null;
          status: string;
          topic_id: string | null;
        };
        Insert: {
          created_at?: string;
          error?: string | null;
          id?: string;
          image_model?: string;
          model?: string;
          post_id?: string | null;
          schedule_id?: string | null;
          status?: string;
          topic_id?: string | null;
        };
        Update: {
          created_at?: string;
          error?: string | null;
          id?: string;
          image_model?: string;
          model?: string;
          post_id?: string | null;
          schedule_id?: string | null;
          status?: string;
          topic_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_generation_runs_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_generation_runs_schedule_id_fkey";
            columns: ["schedule_id"];
            isOneToOne: false;
            referencedRelation: "blog_schedules";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_generation_runs_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "blog_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts: {
        Row: {
          body: string | null;
          category: string;
          created_at: string;
          excerpt: string;
          id: string;
          image_alt: string | null;
          image_prompt: string | null;
          image_src: string | null;
          is_ai_generated: boolean;
          is_featured: boolean;
          is_published: boolean;
          published_at: string;
          published_label: string;
          read_time: string;
          slug: string;
          sort_order: number;
          sources: Json;
          tags: string[];
          title: string;
          topic_id: string | null;
          updated_at: string;
        };
        Insert: {
          body?: string | null;
          category?: string;
          created_at?: string;
          excerpt?: string;
          id?: string;
          image_alt?: string | null;
          image_prompt?: string | null;
          image_src?: string | null;
          is_ai_generated?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          published_at?: string;
          published_label?: string;
          read_time?: string;
          slug: string;
          sort_order?: number;
          sources?: Json;
          tags?: string[];
          title: string;
          topic_id?: string | null;
          updated_at?: string;
        };
        Update: {
          body?: string | null;
          category?: string;
          created_at?: string;
          excerpt?: string;
          id?: string;
          image_alt?: string | null;
          image_prompt?: string | null;
          image_src?: string | null;
          is_ai_generated?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          published_at?: string;
          published_label?: string;
          read_time?: string;
          slug?: string;
          sort_order?: number;
          sources?: Json;
          tags?: string[];
          title?: string;
          topic_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "blog_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_schedules: {
        Row: {
          created_at: string;
          day_of_month: number | null;
          day_of_week: number | null;
          frequency: string;
          hour: number;
          id: string;
          is_active: boolean;
          last_run_at: string | null;
          name: string;
          next_run_at: string | null;
          posts_per_run: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          day_of_month?: number | null;
          day_of_week?: number | null;
          frequency?: string;
          hour?: number;
          id?: string;
          is_active?: boolean;
          last_run_at?: string | null;
          name?: string;
          next_run_at?: string | null;
          posts_per_run?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          day_of_month?: number | null;
          day_of_week?: number | null;
          frequency?: string;
          hour?: number;
          id?: string;
          is_active?: boolean;
          last_run_at?: string | null;
          name?: string;
          next_run_at?: string | null;
          posts_per_run?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_topics: {
        Row: {
          angle: string;
          category: string;
          created_at: string;
          generated_post_id: string | null;
          id: string;
          last_error: string | null;
          rationale: string;
          score: number;
          signals: Json;
          source: string;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          angle?: string;
          category?: string;
          created_at?: string;
          generated_post_id?: string | null;
          id?: string;
          last_error?: string | null;
          rationale?: string;
          score?: number;
          signals?: Json;
          source?: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          angle?: string;
          category?: string;
          created_at?: string;
          generated_post_id?: string | null;
          id?: string;
          last_error?: string | null;
          rationale?: string;
          score?: number;
          signals?: Json;
          source?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_topics_generated_post_id_fkey";
            columns: ["generated_post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      faq_items: {
        Row: {
          answer: string;
          created_at: string;
          highlights: string[];
          id: string;
          is_published: boolean;
          question: string;
          section_id: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          answer: string;
          created_at?: string;
          highlights?: string[];
          id?: string;
          is_published?: boolean;
          question: string;
          section_id: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          answer?: string;
          created_at?: string;
          highlights?: string[];
          id?: string;
          is_published?: boolean;
          question?: string;
          section_id?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "faq_items_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "faq_sections";
            referencedColumns: ["id"];
          },
        ];
      };
      faq_sections: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          index_label: string;
          is_published: boolean;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: string;
          index_label: string;
          is_published?: boolean;
          slug: string;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          index_label?: string;
          is_published?: boolean;
          slug?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          client: string;
          code: string;
          created_at: string;
          deadline: string;
          id: string;
          image_alt: string | null;
          image_before_alt: string | null;
          image_before_src: string | null;
          image_src: string | null;
          is_published: boolean;
          location: string;
          name: string;
          slug: string | null;
          sort_order: number;
          status: Database["public"]["Enums"]["project_status"];
          summary: string;
          type: Database["public"]["Enums"]["project_type"];
          updated_at: string;
          value: string;
        };
        Insert: {
          client?: string;
          code: string;
          created_at?: string;
          deadline?: string;
          id?: string;
          image_alt?: string | null;
          image_before_alt?: string | null;
          image_before_src?: string | null;
          image_src?: string | null;
          is_published?: boolean;
          location?: string;
          name: string;
          slug?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["project_status"];
          summary?: string;
          type: Database["public"]["Enums"]["project_type"];
          updated_at?: string;
          value?: string;
        };
        Update: {
          client?: string;
          code?: string;
          created_at?: string;
          deadline?: string;
          id?: string;
          image_alt?: string | null;
          image_before_alt?: string | null;
          image_before_src?: string | null;
          image_src?: string | null;
          is_published?: boolean;
          location?: string;
          name?: string;
          slug?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["project_status"];
          summary?: string;
          type?: Database["public"]["Enums"]["project_type"];
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      rental_machines: {
        Row: {
          access_requirements: string[];
          category: string;
          created_at: string;
          id: string;
          image_alt: string | null;
          image_src: string | null;
          is_available: boolean;
          is_published: boolean;
          long_description: string;
          price: string;
          short_description: string;
          slug: string;
          sort_order: number;
          specs: Json;
          title: string;
          updated_at: string;
          uses: string[];
        };
        Insert: {
          access_requirements?: string[];
          category?: string;
          created_at?: string;
          id?: string;
          image_alt?: string | null;
          image_src?: string | null;
          is_available?: boolean;
          is_published?: boolean;
          long_description?: string;
          price?: string;
          short_description?: string;
          slug: string;
          sort_order?: number;
          specs?: Json;
          title: string;
          updated_at?: string;
          uses?: string[];
        };
        Update: {
          access_requirements?: string[];
          category?: string;
          created_at?: string;
          id?: string;
          image_alt?: string | null;
          image_src?: string | null;
          is_available?: boolean;
          is_published?: boolean;
          long_description?: string;
          price?: string;
          short_description?: string;
          slug?: string;
          sort_order?: number;
          specs?: Json;
          title?: string;
          updated_at?: string;
          uses?: string[];
        };
        Relationships: [];
      };
      rental_requests: {
        Row: {
          code: string;
          created_at: string;
          email: string | null;
          id: string;
          location: string | null;
          machine: string;
          message: string | null;
          name: string;
          period: string | null;
          phone: string | null;
          status: Database["public"]["Enums"]["request_status"];
          updated_at: string;
        };
        Insert: {
          code?: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          location?: string | null;
          machine?: string;
          message?: string | null;
          name: string;
          period?: string | null;
          phone?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          location?: string | null;
          machine?: string;
          message?: string | null;
          name?: string;
          period?: string | null;
          phone?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      service_groups: {
        Row: {
          created_at: string;
          href: string;
          id: string;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          href: string;
          id?: string;
          slug: string;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          href?: string;
          id?: string;
          slug?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          announcement: Json;
          contact: Json;
          floating: Json;
          hours: Json;
          id: number;
          phones: Json;
          social: Json;
          updated_at: string;
        };
        Insert: {
          announcement?: Json;
          contact?: Json;
          floating?: Json;
          hours?: Json;
          id?: number;
          phones?: Json;
          social?: Json;
          updated_at?: string;
        };
        Update: {
          announcement?: Json;
          contact?: Json;
          floating?: Json;
          hours?: Json;
          id?: number;
          phones?: Json;
          social?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_requests: {
        Row: {
          channel: Database["public"]["Enums"]["request_channel"];
          code: string;
          created_at: string;
          description: string | null;
          email: string | null;
          id: string;
          location: string | null;
          name: string;
          phone: string | null;
          service: string | null;
          status: Database["public"]["Enums"]["request_status"];
          surface: string | null;
          updated_at: string;
        };
        Insert: {
          channel?: Database["public"]["Enums"]["request_channel"];
          code?: string;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: string;
          location?: string | null;
          name: string;
          phone?: string | null;
          service?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          surface?: string | null;
          updated_at?: string;
        };
        Update: {
          channel?: Database["public"]["Enums"]["request_channel"];
          code?: string;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: string;
          location?: string | null;
          name?: string;
          phone?: string | null;
          service?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          surface?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          created_at: string;
          description: string;
          eyebrow: string;
          faqs: Json;
          group_slug: string | null;
          id: string;
          image_alt: string | null;
          image_src: string | null;
          in_mosaic: boolean;
          is_mosaic_hero: boolean;
          is_mosaic_wide: boolean;
          is_published: boolean;
          processes: Json;
          short_title: string | null;
          slug: string;
          sort_order: number;
          specs: Json;
          summary: string;
          summary_title: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          eyebrow?: string;
          faqs?: Json;
          group_slug?: string | null;
          id?: string;
          image_alt?: string | null;
          image_src?: string | null;
          in_mosaic?: boolean;
          is_mosaic_hero?: boolean;
          is_mosaic_wide?: boolean;
          is_published?: boolean;
          processes?: Json;
          short_title?: string | null;
          slug: string;
          sort_order?: number;
          specs?: Json;
          summary?: string;
          summary_title?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          eyebrow?: string;
          faqs?: Json;
          group_slug?: string | null;
          id?: string;
          image_alt?: string | null;
          image_src?: string | null;
          in_mosaic?: boolean;
          is_mosaic_hero?: boolean;
          is_mosaic_wide?: boolean;
          is_published?: boolean;
          processes?: Json;
          short_title?: string | null;
          slug?: string;
          sort_order?: number;
          specs?: Json;
          summary?: string;
          summary_title?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_group_slug_fkey";
            columns: ["group_slug"];
            isOneToOne: false;
            referencedRelation: "service_groups";
            referencedColumns: ["slug"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      campaign_status: "draft" | "scheduled" | "sending" | "sent" | "failed";
      contact_status: "active" | "unsubscribed" | "bounced" | "complained";
      email_audience: "user" | "admin" | "broadcast";
      email_category: "tranzactional" | "marketing" | "sistem";
      email_status:
        | "queued"
        | "sent"
        | "delivered"
        | "bounced"
        | "complained"
        | "opened"
        | "failed";
      project_status:
        | "Ofertat"
        | "Planificat"
        | "În execuție"
        | "Finalizat"
        | "Suspendat";
      project_type: "Excavări" | "Terasamente" | "Amenajări" | "Închiriere";
      request_channel: "Formular" | "Telefon" | "Email";
      request_status: "Nouă" | "În evaluare" | "Ofertat" | "Confirmat" | "Închisă";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      project_status: ["Ofertat", "Planificat", "În execuție", "Finalizat", "Suspendat"],
      project_type: ["Excavări", "Terasamente", "Amenajări", "Închiriere"],
      request_channel: ["Formular", "Telefon", "Email"],
      request_status: ["Nouă", "În evaluare", "Ofertat", "Confirmat", "Închisă"],
    },
  },
} as const;
