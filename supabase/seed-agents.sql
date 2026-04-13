-- Seed: AI Agents (Copilot subscriptions)
-- Provider: Anthropic/GitHub | Cost: R176/sub/month (17600 cents)
-- Models: Claude Sonnet (coding/data) | Claude Opus (design/creative)
-- Run in Supabase SQL Editor → https://supabase.com/dashboard/project/nxuvzdrqgrmureejigpf/sql

INSERT INTO ai_agents (name, purpose, model, provider, monthly_cost, status, config_notes)
VALUES
  (
    'Analytics',
    'Analytics and reporting — spending charts, cost breakdowns, financial data, budget tracking, and cost projections.',
    'Claude Sonnet',
    'Anthropic/GitHub',
    17600,
    'active',
    'Used in employee-management project. Add new charts, spending reports, and analytics features.'
  ),
  (
    'Data-Layer',
    'Data/backend specialist — SQLite database operations, data models, Provider state management, schema design, migrations, and CRUD operations.',
    'Claude Sonnet',
    'Anthropic/GitHub',
    17600,
    'active',
    'Used in employee-management project. Handles all data layer work including AppState synchronization.'
  ),
  (
    'Flutter-UI',
    'Flutter UI specialist — building screens, widgets, dialogs, fixing UI bugs, Material 3 dark theme, responsive desktop layouts, and navigation.',
    'Claude Sonnet',
    'Anthropic/GitHub',
    17600,
    'active',
    'Used in employee-management project. Handles all Flutter UI/component work.'
  ),
  (
    'Tester',
    'Testing specialist — writing and running Flutter widget and unit tests, test coverage, mocking patterns, and regression testing.',
    'Claude Sonnet',
    'Anthropic/GitHub',
    17600,
    'active',
    'Used in employee-management project. Handles test-driven development and verifying functionality.'
  ),
  (
    'UI-UX Designer',
    'Expert UI/UX design critic — research-backed, opinionated design feedback citing Nielsen Norman Group studies. Avoids generic aesthetics and provides distinctive design direction.',
    'Claude Opus',
    'Anthropic/GitHub',
    17600,
    'active',
    'Used in employee-management project. Specialises in usability research and evidence-based design decisions.'
  ),
  (
    'Swift Marketing & Branding',
    'Marketing and branding specialist for Swift Designz — social media posts, email signatures, ad copy, website copy, and brand assets following Swift Designz brand guidelines.',
    'Claude Opus',
    'Anthropic/GitHub',
    17600,
    'active',
    'Used in swift-designz-admin project. Strictly follows Swift Designz brand colours and tone.'
  );
