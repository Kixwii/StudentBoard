# Quick fix for jose on OTP 27
deps_path = "deps/jose/include/jose_public_key.hrl"

if File.exists?(deps_path) do
  content = File.read!(deps_path)
  
  unless String.contains?(content, "OTP_27_FIX") do
    fix = """
    
    %% OTP_27_FIX - Compatibility macros
    -ifndef(?id-PBES2).
    -define(id-PBES2, {1,2,840,113549,1,5,13}).
    -endif.
    -ifndef(?id-PBKDF2).
    -define(id-PBKDF2, {1,2,840,113549,1,5,12}).
    -endif.
    -ifndef(?id-hmacWithSHA1).
    -define(id-hmacWithSHA1, {1,2,840,113549,2,7}).
    -endif.
    -ifndef(?rc2CBC).
    -define(rc2CBC, {1,2,840,113549,3,2}).
    -endif.
    -ifndef(?id-ecPublicKey).
    -define(id-ecPublicKey, {1,2,840,10045,2,1}).
    -endif.
    -ifndef(?rsaEncryption).
    -define(rsaEncryption, {1,2,840,113549,1,1,1}).
    -endif.
    """
    
    updated = String.replace(content, 
      "-include_lib(\"public_key/include/public_key.hrl\").",
      "-include_lib(\"public_key/include/public_key.hrl\").\n" <> fix)
    
    File.write!(deps_path, updated)
    IO.puts("✅ Patched jose")
  end
end
