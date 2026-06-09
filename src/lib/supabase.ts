import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          avatar_url: string;
          role: 'talent' | 'client' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      voice_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          headline: string;
          bio: string;
          avatar_url: string;
          elevenlabs_voice_link: string;
          voice_style_tags: string[];
          languages: string[];
          accent: string;
          gender: string;
          age_range: string;
          genres: string[];
          commercial_use: boolean;
          pricing_text: string;
          pricing_min: number;
          pricing_max: number;
          availability: 'available' | 'busy' | 'unavailable';
          social_links: Record<string, string>;
          status: 'pending' | 'approved' | 'rejected';
          rejection_reason: string;
          views: number;
          contact_clicks: number;
          is_featured: boolean;
          is_verified: boolean;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['voice_profiles']['Row']> & {
          user_id: string;
          name: string;
          elevenlabs_voice_link: string;
        };
        Update: Partial<Database['public']['Tables']['voice_profiles']['Row']>;
      };
      inquiries: {
        Row: {
          id: string;
          voice_profile_id: string;
          talent_user_id: string;
          sender_name: string;
          sender_email: string;
          sender_company: string;
          message: string;
          project_type: string;
          budget: string;
          status: 'new' | 'read' | 'replied' | 'archived';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at' | 'status'>;
        Update: Partial<Database['public']['Tables']['inquiries']['Row']>;
      };
    };
  };
};
