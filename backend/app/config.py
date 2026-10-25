from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "phishguard"
    cors_origins: str = "http://localhost:5173"
    jwt_secret: str = "change-this-secret-before-you-deploy-0000"
    jwt_expire_minutes: int = 720
    admin_emails: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def admin_list(self) -> list[str]:
        return [e.strip().lower() for e in self.admin_emails.split(",") if e.strip()]


settings = Settings()
