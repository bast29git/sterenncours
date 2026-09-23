import { onRequestPost as __api_seances__id__choix_js_onRequestPost } from "/home/user/sterenncours/functions/api/seances/[id]/choix.js"
import { onRequestPost as __api_seances_lot_js_onRequestPost } from "/home/user/sterenncours/functions/api/seances/lot.js"
import { onRequestDelete as __api_fichiers__id__js_onRequestDelete } from "/home/user/sterenncours/functions/api/fichiers/[id].js"
import { onRequestGet as __api_fichiers__id__js_onRequestGet } from "/home/user/sterenncours/functions/api/fichiers/[id].js"
import { onRequestDelete as __api_seances__id__js_onRequestDelete } from "/home/user/sterenncours/functions/api/seances/[id].js"
import { onRequestPatch as __api_seances__id__js_onRequestPatch } from "/home/user/sterenncours/functions/api/seances/[id].js"
import { onRequestPost as __api_connexion_js_onRequestPost } from "/home/user/sterenncours/functions/api/connexion.js"
import { onRequestPost as __api_deconnexion_js_onRequestPost } from "/home/user/sterenncours/functions/api/deconnexion.js"
import { onRequestGet as __api_etat_js_onRequestGet } from "/home/user/sterenncours/functions/api/etat.js"
import { onRequestPut as __api_fiches_js_onRequestPut } from "/home/user/sterenncours/functions/api/fiches.js"
import { onRequestGet as __api_fichiers_index_js_onRequestGet } from "/home/user/sterenncours/functions/api/fichiers/index.js"
import { onRequestPost as __api_fichiers_index_js_onRequestPost } from "/home/user/sterenncours/functions/api/fichiers/index.js"
import { onRequestGet as __api_messages_js_onRequestGet } from "/home/user/sterenncours/functions/api/messages.js"
import { onRequestPatch as __api_messages_js_onRequestPatch } from "/home/user/sterenncours/functions/api/messages.js"
import { onRequestPost as __api_messages_js_onRequestPost } from "/home/user/sterenncours/functions/api/messages.js"
import { onRequestGet as __api_moi_js_onRequestGet } from "/home/user/sterenncours/functions/api/moi.js"
import { onRequestPut as __api_resultats_js_onRequestPut } from "/home/user/sterenncours/functions/api/resultats.js"
import { onRequestGet as __api_seances_js_onRequestGet } from "/home/user/sterenncours/functions/api/seances.js"
import { onRequestPost as __api_seances_js_onRequestPost } from "/home/user/sterenncours/functions/api/seances.js"
import { onRequestPut as __api_suivi_js_onRequestPut } from "/home/user/sterenncours/functions/api/suivi.js"
import { onRequest as ___middleware_js_onRequest } from "/home/user/sterenncours/functions/_middleware.js"

export const routes = [
    {
      routePath: "/api/seances/:id/choix",
      mountPath: "/api/seances/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_seances__id__choix_js_onRequestPost],
    },
  {
      routePath: "/api/seances/lot",
      mountPath: "/api/seances",
      method: "POST",
      middlewares: [],
      modules: [__api_seances_lot_js_onRequestPost],
    },
  {
      routePath: "/api/fichiers/:id",
      mountPath: "/api/fichiers",
      method: "DELETE",
      middlewares: [],
      modules: [__api_fichiers__id__js_onRequestDelete],
    },
  {
      routePath: "/api/fichiers/:id",
      mountPath: "/api/fichiers",
      method: "GET",
      middlewares: [],
      modules: [__api_fichiers__id__js_onRequestGet],
    },
  {
      routePath: "/api/seances/:id",
      mountPath: "/api/seances",
      method: "DELETE",
      middlewares: [],
      modules: [__api_seances__id__js_onRequestDelete],
    },
  {
      routePath: "/api/seances/:id",
      mountPath: "/api/seances",
      method: "PATCH",
      middlewares: [],
      modules: [__api_seances__id__js_onRequestPatch],
    },
  {
      routePath: "/api/connexion",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_connexion_js_onRequestPost],
    },
  {
      routePath: "/api/deconnexion",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_deconnexion_js_onRequestPost],
    },
  {
      routePath: "/api/etat",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_etat_js_onRequestGet],
    },
  {
      routePath: "/api/fiches",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_fiches_js_onRequestPut],
    },
  {
      routePath: "/api/fichiers",
      mountPath: "/api/fichiers",
      method: "GET",
      middlewares: [],
      modules: [__api_fichiers_index_js_onRequestGet],
    },
  {
      routePath: "/api/fichiers",
      mountPath: "/api/fichiers",
      method: "POST",
      middlewares: [],
      modules: [__api_fichiers_index_js_onRequestPost],
    },
  {
      routePath: "/api/messages",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_messages_js_onRequestGet],
    },
  {
      routePath: "/api/messages",
      mountPath: "/api",
      method: "PATCH",
      middlewares: [],
      modules: [__api_messages_js_onRequestPatch],
    },
  {
      routePath: "/api/messages",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_messages_js_onRequestPost],
    },
  {
      routePath: "/api/moi",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_moi_js_onRequestGet],
    },
  {
      routePath: "/api/resultats",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_resultats_js_onRequestPut],
    },
  {
      routePath: "/api/seances",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_seances_js_onRequestGet],
    },
  {
      routePath: "/api/seances",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_seances_js_onRequestPost],
    },
  {
      routePath: "/api/suivi",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_suivi_js_onRequestPut],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]