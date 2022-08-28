export interface Client {
    clientId: string,
    clientSecret: string,
    domain: string,
    serviceName: string,
    redirectURI: string,
    scopeList: string[],
    access: string
}

export interface OauthScope {
    id: string,
    name: string,
    description: string
};

export type OauthScopeList = OauthScope[];