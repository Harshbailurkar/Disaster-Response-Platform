const supabase = require("./supabaseClient");

exports.getCache = async (key) => {
  const { data, error } = await supabase
    .from("cache")
    .select("*")
    .eq("key", key)
    .single();

  if (error || !data) return null;

  const now = new Date();
  const expiry = new Date(data.expires_at);

  if (now > expiry) {
    // Cache expired
    await supabase.from("cache").delete().eq("key", key);
    return null;
  }

  return data.value;
};

exports.setCache = async (key, value, ttlMinutes = 60) => {
  const expires_at = new Date(
    Date.now() + ttlMinutes * 60 * 1000
  ).toISOString();

  const { error } = await supabase.from("cache").upsert({
    key,
    value,
    expires_at,
  });

  if (error) console.error("Failed to set cache:", error.message);
};
