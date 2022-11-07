/**
 * @fileOverview
 * Wrapper um auf Kontext-Informationen der Umgebung zuzugreifen. Um auf die
 * Auth-Infos zuzugreifen sollte man den Weg über den Store gehen (Module: module-auth).
 *
 * Das Objekt window.mc muss die baseUrl und weitere Informationen enthalten,
 * existiert das Objekt nicht, so werden Standard-Infos für die Entwicklungszeit
 * zurückgegeben.
 */

const NO_URL = "NO URL GIVEN!!";

/**
 * Das context Object
 * */
const context = (function () {
    if (typeof window !== "undefined" && window.glossary) {
        let context = window.glossary;
        let baseUrl = context.BASE_URL ? context.BASE_URL : context.baseUrl;
        return {
            wsBaseUrl: (function () {
                let u = new URL(baseUrl);
                u.protocol = "ws";
                return u.href;
            }()),
            baseUrl: baseUrl,
            logoutUrl: context.LOGOUT_URL ? context.LOGOUT_URL : context.logoutUrl,
            realUserName: context.realUserName,
            isAdmin: context.isAdmin,
            isAuthor: context.isAuthor,
        };
    }
    console.error("object with context information not found");
    return {
        wsBaseUrl: NO_URL,
        baseUrl: NO_URL,
        logoutUrl: NO_URL,
        realUserName: null,
        isAdmin: true,
        isAuthor: true,
    };
}());
//export default context;
export { context, NO_URL };