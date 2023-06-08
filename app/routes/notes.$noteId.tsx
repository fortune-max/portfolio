import { config } from 'dotenv';
import type { ActionFunction, LoaderArgs } from "@remix-run/node";

config();
const NOTES_SERVER = process.env.NOTES_SERVER || 'http://localhost:3000';

export async function loader({ params, request }: LoaderArgs) {
  const { noteId } = params;
  const addendum = request.url.split(`/notes/${noteId}`)[1];

  const resp = await fetch(`${NOTES_SERVER}/notes/${noteId}${addendum || ''}`, {
    method: 'GET',
    headers: {'Content-Type': request.headers.get('Content-Type') || 'text/plain'},
  }).then((response) => response);

  return resp;
}

export const action: ActionFunction = async ({ request, params }) => {
  const { noteId } = params;
  const addendum = request.url.split(`/notes/${noteId}`)[1];

  const resp = await fetch(`${NOTES_SERVER}/notes/${noteId}${addendum || ''}`, {
    method: request.method,
    headers: {'Content-Type': request.headers.get('Content-Type') || 'text/plain'},
    body: await request.text(),
  }).then((response) => response);

  return resp;
}
