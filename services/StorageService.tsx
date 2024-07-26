// groqchat/services/StorageService.ts
class StorageService {
    private static readonly MODE_KEY = "groqchat-mode";
    private static readonly SYSTEM_PROMPT_KEY = "groqchat-systemPrompt";
    private static readonly GROQ_API_TOKEN_KEY = "groqchat-groqAPIToken";
    private static readonly MONGODB_CONNECTION_STRING_KEY = "groqchat-mongoDBConnectionString";
    private static readonly DATABASE_TYPE = "indexedDB";
    private static readonly DEFAULT_MODEL_KEY = "groqchat-defaultModel";
    private static readonly MODEL_KEY = "groqchat-currentSessionModel";
    private static readonly CURRENT_SESSION_MODEL_KEY = "groqchat-currentSessionModel";
    private static readonly OPENAI_WHISPER_KEY = "groqchat-openaiWhisper";

    static getMode(): string | null {
        return localStorage.getItem(StorageService.MODE_KEY);
    }

    static saveMode(mode: string): void {
        localStorage.setItem(StorageService.MODE_KEY, mode);
    }

    static getModel(): string | null {
        return localStorage.getItem(StorageService.MODEL_KEY);
    }

    static saveModel(model: string): void {
        localStorage.setItem(StorageService.MODEL_KEY, model);
    }

    static getDefaultModel(): string | null {
        return localStorage.getItem(StorageService.DEFAULT_MODEL_KEY);
    }

    static saveDefaultModel(model: string): void {
        localStorage.setItem(StorageService.DEFAULT_MODEL_KEY, model);
    }

    static getCurrentSessionModel(): string | null {
        return localStorage.getItem(StorageService.CURRENT_SESSION_MODEL_KEY);
    }

    static saveCurrentSessionModel(model: string): void {
        localStorage.setItem(StorageService.CURRENT_SESSION_MODEL_KEY, model);
    }

    static getSystemPrompt(): string | null {
        return localStorage.getItem(StorageService.SYSTEM_PROMPT_KEY);
    }

    static saveSystemPrompt(systemPrompt: string): void {
        localStorage.setItem(StorageService.SYSTEM_PROMPT_KEY, systemPrompt);
    }

    static getGroqAPIToken(): string | null {
        return localStorage.getItem(StorageService.GROQ_API_TOKEN_KEY);
    }

    static saveGroqAPIToken(groqAPIToken: string): void {
        localStorage.setItem(StorageService.GROQ_API_TOKEN_KEY, groqAPIToken);
    }

    static getMongoDBConnectionString(): string | null {
        return localStorage.getItem(StorageService.MONGODB_CONNECTION_STRING_KEY);
    }

    static saveMongoDBConnectionString(mongoDBConnectionString: string): void {
        localStorage.setItem(StorageService.MONGODB_CONNECTION_STRING_KEY, mongoDBConnectionString);
    }

    static getDatabaseType(): string {
        return StorageService.DATABASE_TYPE;
    }

    static saveDatabaseType(databaseType: string): void {
        localStorage.setItem(StorageService.DATABASE_TYPE, databaseType);
    }

    static getOpenAIWhisperAPIToken(): string | null {
        return localStorage.getItem(StorageService.OPENAI_WHISPER_KEY);
    }

    static saveOpenAIWhisperAPIToken(openAIWhisper: string): void {
        localStorage.setItem(StorageService.OPENAI_WHISPER_KEY, openAIWhisper);
    }

    static clear(): void {
        localStorage.clear();
    }

    static isOnboardingCompleted(): boolean {
        return !!localStorage.getItem(StorageService.GROQ_API_TOKEN_KEY);
    }
}

export default StorageService;
