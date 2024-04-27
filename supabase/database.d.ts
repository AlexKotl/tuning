export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      instruments: {
        Row: {
          createdAt: string
          id: number
          title: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: number
          title?: string | null
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: number
          title?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      parser_logs: {
        Row: {
          createdAt: string
          difficultyParam: string | null
          fromParam: number | null
          id: number
          instParam: string | null
          patternParam: string | null
          sizeParam: number | null
          tuningParam: string | null
          updateAt: string | null
        }
        Insert: {
          createdAt?: string
          difficultyParam?: string | null
          fromParam?: number | null
          id?: number
          instParam?: string | null
          patternParam?: string | null
          sizeParam?: number | null
          tuningParam?: string | null
          updateAt?: string | null
        }
        Update: {
          createdAt?: string
          difficultyParam?: string | null
          fromParam?: number | null
          id?: number
          instParam?: string | null
          patternParam?: string | null
          sizeParam?: number | null
          tuningParam?: string | null
          updateAt?: string | null
        }
        Relationships: []
      }
      songs: {
        Row: {
          artist: string | null
          createdAt: string | null
          id: number
          instrumentId: number | null
          songId: number
          string1TuningId: number | null
          string2TuningId: number | null
          string3TuningId: number | null
          string4TuningId: number | null
          string5TuningId: number | null
          string6TuningId: number | null
          string7TuningId: number | null
          title: string | null
          updatedAt: string | null
          views: number | null
        }
        Insert: {
          artist?: string | null
          createdAt?: string | null
          id?: number
          instrumentId?: number | null
          songId: number
          string1TuningId?: number | null
          string2TuningId?: number | null
          string3TuningId?: number | null
          string4TuningId?: number | null
          string5TuningId?: number | null
          string6TuningId?: number | null
          string7TuningId?: number | null
          title?: string | null
          updatedAt?: string | null
          views?: number | null
        }
        Update: {
          artist?: string | null
          createdAt?: string | null
          id?: number
          instrumentId?: number | null
          songId?: number
          string1TuningId?: number | null
          string2TuningId?: number | null
          string3TuningId?: number | null
          string4TuningId?: number | null
          string5TuningId?: number | null
          string6TuningId?: number | null
          string7TuningId?: number | null
          title?: string | null
          updatedAt?: string | null
          views?: number | null
        }
        Relationships: []
      }
      tunings: {
        Row: {
          id: number
          tuning: string | null
        }
        Insert: {
          id?: number
          tuning?: string | null
        }
        Update: {
          id?: number
          tuning?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
