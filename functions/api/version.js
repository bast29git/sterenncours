/**
 * B188 : GET /api/version : la version déployée et la date du build, sans session.
 * Le site compare avec la version qu'il a chargée pour proposer un rechargement.
 */
import { json, methodeNonPermise } from '../_commun.js';
import { VERSION, DEPLOYE_LE } from '../_programme.js';

export const onRequest = methodeNonPermise(['GET']);
export const onRequestGet = () => json({ version: VERSION, deploye_le: DEPLOYE_LE }, 200, { 'cache-control': 'no-store' });
