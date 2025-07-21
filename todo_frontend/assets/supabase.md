# Supabase Integration for todo_frontend

## Environment Variables

You must add the following variables to your `.env` file (in the root of your todo_frontend directory):

```
REACT_APP_SUPABASE_URL=<Your Supabase Project URL>
REACT_APP_SUPABASE_KEY=<Your Supabase anon/public key>
```

> **Example:**
>
> REACT_APP_SUPABASE_URL=https://rvclzovqglkbhfqekxbh.supabase.co
> REACT_APP_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Y2x6b3ZxZ2xrYmhmcWVreGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODc4MjcsImV4cCI6MjA2ODY2MzgyN30.hccspMckeih8XxbzTTD5_y0i96M04wFIMITdnDJ8aN4

## Usage

The React app loads the credentials from environment variables using the `REACT_APP_` prefix (required by Create React App).
Supabase client is initialized from `src/supabaseClient.js`.

## Todo Table

The required table in your Supabase Database is:

**Table**: `todos`

| Field     | Type    | Required | Details                       |
|-----------|---------|----------|-------------------------------|
| id        | int8 PK | Yes      | Auto-increment                |
| content   | text    | Yes      | Task description              |
| completed | boolean | Yes      | Mark as complete/incomplete   |

## React Integration

All Supabase calls are made directly from the frontend using the JS client and the above environment variables.
