CREATE OR REPLACE FUNCTION "public"."create_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public."User"(id, email, created_at, updated_at)
  values (new.id, new.email, now(), now());

  return new;
end;$$;

ALTER FUNCTION "public"."create_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  delete from auth.users where id = old.id;
  return old;
end;$$;

ALTER FUNCTION "public"."delete_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."verify_user_password"("password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = auth.uid() AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$$;

ALTER FUNCTION "public"."verify_user_password"("password" "text") OWNER TO "postgres";

CREATE OR REPLACE TRIGGER "delete_user" AFTER DELETE ON "public"."User" FOR EACH ROW EXECUTE FUNCTION "public"."delete_user"();

CREATE POLICY "Users can view their own data" ON "public"."User" FOR SELECT USING (("auth"."uid"() = "id"));

ALTER TABLE "public"."Account" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Action" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ActionClass" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ApiKey" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Attribute" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."AttributeClass" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Display" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Environment" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Integration" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Invite" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Membership" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Person" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Product" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Response" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ResponseNote" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."ShortUrl" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Workflow" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."WorkflowAttributeFilter" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."WorkflowTrigger" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Tag" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."TagsOnResponses" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Team" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."Webhook" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Account" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Account" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Action" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Action" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."ActionClass" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."ActionClass" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."ApiKey" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."ApiKey" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Attribute" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Attribute" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."AttributeClass" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."AttributeClass" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Display" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Display" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Environment" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Environment" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Integration" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Integration" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Invite" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Invite" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Membership" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Membership" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Person" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Person" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Product" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Product" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Response" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Response" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."ResponseNote" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."ResponseNote" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."ShortUrl" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."ShortUrl" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Workflow" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Workflow" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."WorkflowAttributeFilter" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."WorkflowAttributeFilter" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."WorkflowTrigger" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."WorkflowTrigger" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Tag" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Tag" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."TagsOnResponses" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."TagsOnResponses" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Team" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Team" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."User" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."User" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Webhook" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."Webhook" TO "anon";

GRANT SELECT,INSERT,UPDATE ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."_prisma_migrations" TO "anon";

RESET ALL;

-- You'll need to run this query manually in Supabase
-- Query -> create or replace trigger create_user after insert on auth.users for each row execute function create_user();