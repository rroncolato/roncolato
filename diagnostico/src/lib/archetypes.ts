/** Os 12 arquétipos — linguagem de percepção visual, não diagnóstico psicológico. */

export type ArchetypeId =
  | "sabio"
  | "governante"
  | "criador"
  | "mago"
  | "heroi"
  | "cuidador"
  | "amante"
  | "explorador"
  | "rebelde"
  | "cara-comum"
  | "inocente"
  | "bobo-da-corte";

export type Archetype = {
  id: ArchetypeId;
  name: string;
  essence: string;
};

export const ARCHETYPES: Archetype[] = [
  { id: "sabio", name: "Sábio", essence: "conhecimento, clareza e profundidade" },
  { id: "governante", name: "Governante", essence: "liderança, controle e estabilidade" },
  { id: "criador", name: "Criador", essence: "originalidade, expressão e inovação" },
  { id: "mago", name: "Mago", essence: "transformação, visão e possibilidades" },
  { id: "heroi", name: "Herói", essence: "coragem, disciplina e superação" },
  { id: "cuidador", name: "Cuidador", essence: "proteção, acolhimento e serviço" },
  { id: "amante", name: "Amante", essence: "conexão, sensibilidade e presença" },
  { id: "explorador", name: "Explorador", essence: "liberdade, autenticidade e independência" },
  { id: "rebelde", name: "Rebelde", essence: "ruptura, provocação e inconformismo" },
  { id: "cara-comum", name: "Cara Comum", essence: "proximidade, pertencimento e simplicidade" },
  { id: "inocente", name: "Inocente", essence: "leveza, esperança e confiança" },
  { id: "bobo-da-corte", name: "Bobo da Corte", essence: "espontaneidade, alegria e descontração" },
];

export const ARCHETYPE_IDS = ARCHETYPES.map((a) => a.id) as [ArchetypeId, ...ArchetypeId[]];

export const MAX_DESIRED_ARCHETYPES = 2;

export function archetypeById(id: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}
