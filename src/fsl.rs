use zed::LanguageServerId;
use zed_extension_api::{self as zed, Result};

struct FslExtension;

impl zed::Extension for FslExtension {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let command = worktree
            .which("fslc-lsp")
            .ok_or_else(|| "fslc-lsp was not found on PATH".to_string())?;

        Ok(zed::Command {
            command,
            args: Vec::new(),
            env: Default::default(),
        })
    }
}

zed::register_extension!(FslExtension);
