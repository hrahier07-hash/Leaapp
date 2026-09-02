import type { StoryBeat } from "@/lib/story/types";

export const STORY_WORLD_TITLE = "Le Grimoire Déchiré";

export const STORY_WORLD_PITCH =
  "Elian a déchiré le grimoire ancestral de son village. Chaque grille résolue restaure une page perdue et rapproche le village du réveil.";

/** Textes intégrés tels quels — ne pas paraphraser. */
const CAPTIONS: Record<number, string> = {
  1: "Elian ouvre les yeux sur son village figé : un chat suspendu en plein saut, une théière qui verse un thé immobile dans les airs.",
  2: "Il retrouve son chat, statufié en pleine ronronnade, et comprend que même le temps des animaux s'est arrêté.",
  3: "Une brise glaciale porte un morceau de papier jauni jusqu'à ses pieds : la première page du grimoire.",
  4: "Sur la page, une écriture tremblante : \"Ce que la peur déchire, seul le courage peut le recoudre.\"",
  5: "Elian découvre l'ampleur du désastre du haut de la colline : tout le village, jusqu'à l'horizon, est figé sous un voile de givre bleuté. Il prête serment de tout réparer, page après page.",
  6: "Une statue de pierre à l'entrée de la forêt semble le regarder — celle de son vieux maître, Odren, figé au moment même de la malédiction.",
  7: "Une deuxième page apparaît coincée dans les branches gelées d'un pommier.",
  8: "Le texte de la page est à moitié effacé, mais un mot ressort clairement : \"trahison\".",
  9: "Elian sent un frisson : et si quelqu'un avait déchiré le grimoire volontairement ?",
  10: "Aux pieds de la statue d'Odren, Elian trouve un médaillon brisé en deux — la moitié manquante a été arrachée récemment, pas par la malédiction. Quelqu'un d'autre cherche les pages, lui aussi.",
  11: "En réunissant trois pages, un rayon de couleur traverse un instant le ciel gris du village.",
  12: "Un moineau figé bat des ailes une fraction de seconde avant de se figer à nouveau — la magie répond.",
  13: "Elian rit pour la première fois depuis le début de son périple : \"Ça marche.\"",
  14: "Une page retrouvée dans le puits du village révèle un plan sommaire du grimoire — il en manque encore beaucoup.",
  15: "La rivière du village dégèle sur quelques mètres et se remet à couler, emportant les reflets du soleil couchant. Le village entier semble retenir son souffle, comme s'il sentait le retour de la vie.",
  16: "Des traces de pas fraîches dans la neige gelée — quelqu'un d'autre marche dans le village figé.",
  17: "Une silhouette encapuchonnée s'échappe au loin, une page à la main, la page qu'Elian venait de trouver.",
  18: "Sur le sol, un mot griffonné à la hâte : \"Arrête de chercher. Certaines pages ne doivent jamais être lues.\"",
  19: "Elian retrouve une page évoquant un \"Sceau Interdit\" caché quelque part dans le grimoire original.",
  20: "La silhouette se révèle un instant à la lueur d'une torche : Sylvaine, une ancienne élève d'Odren qu'on croyait partie depuis des années. Pourquoi cache-t-elle des pages plutôt que d'aider à lever la malédiction ?",
  21: "Une page tombée d'un vieux coffre familial porte le sceau de la famille d'Elian.",
  22: "Le texte révèle que le grand-père d'Elian a autrefois aidé à écrire une partie du grimoire — une partie qu'on lui avait interdit de terminer.",
  23: "Elian réalise que la déchirure du grimoire n'était peut-être pas un simple accident.",
  24: "Un vieux villageois à moitié dégelé murmure un seul mot avant de se figer à nouveau : \"Pardon...\"",
  25: "Elian comprend que son grand-père avait volontairement caché le Sceau Interdit dans le grimoire pour protéger le village d'un pouvoir trop dangereux — et que Sylvaine, elle, le cherche pour le libérer.",
  26: "En touchant une page, Elian revit un éclair du souvenir d'un enfant du village, le soir de la malédiction.",
  27: "Dans ce souvenir, une dispute éclate entre Odren et une jeune Sylvaine, à propos d'un pouvoir \"trop grand pour un seul village\".",
  28: "Une page carbonisée sur les bords évoque un rituel capable d'inverser n'importe quelle malédiction — au prix d'un lourd sacrifice.",
  29: "Elian hésite pour la première fois : et si certaines pages valaient mieux rester perdues ?",
  30: "Il choisit de continuer : \"Un village entier mérite une chance, quel qu'en soit le prix à découvrir.\" Le ciel s'éclaircit légèrement au-dessus de la place principale.",
  31: "Sylvaine intercepte Elian pour la première fois, face à face, page contre page.",
  32: "Elle ne veut pas lui nuire : elle cherche à empêcher quelqu'un d'autre de mettre la main sur le Sceau Interdit avant lui.",
  33: "Une page arrachée des mains d'Elian s'envole dans le vent glacé — il doit la rattraper avant qu'elle ne se perde à jamais.",
  34: "Au sommet du clocher gelé, Elian retrouve la page envolée, coincée entre deux cloches immobiles.",
  35: "Sylvaine lui révèle la vérité : un troisième sorcier, resté dans l'ombre depuis le début, a provoqué la malédiction pour forcer le village à déterrer le Sceau Interdit à sa place.",
  36: "Elian et Sylvaine unissent leurs forces, à contrecœur d'abord, puis avec un respect grandissant.",
  37: "Une page retrouvée dans les caves du village décrit précisément le rituel final — et le sacrifice qu'il exige : renoncer à un souvenir cher pour de bon.",
  38: "Elian pense immédiatement à son grand-père, et à tout ce qu'il pourrait perdre en refermant le grimoire.",
  39: "Le troisième sorcier se manifeste enfin, dans une explosion de givre noir au centre du village.",
  40: "Face à face avec l'inconnu, Elian découvre son visage : c'est un ancien camarade d'apprentissage d'Odren, rongé depuis des années par la jalousie d'avoir été écarté du grimoire original.",
  41: "Le combat magique fige littéralement la moitié de la place du village dans un silence de cristal.",
  42: "Sylvaine sacrifie une page qu'elle protégeait depuis des années pour repousser l'attaque de l'ancien camarade.",
  43: "Elian comprend qu'il ne reste qu'une seule page à retrouver : la toute dernière, celle du Sceau lui-même.",
  44: "Il la découvre enfin, nichée dans les racines de l'arbre le plus ancien du village — celui planté le jour de sa naissance.",
  45: "Le grimoire est presque complet. Il ne manque plus qu'à l'refermer et à accepter, ou refuser, le prix du sacrifice qu'exige le rituel final.",
  46: "Elian choisit de sacrifier non pas un souvenir, mais sa propre peur — celle qui l'a empêché, un soir d'orage, de dire la vérité à son maître.",
  47: "Le grimoire se referme dans un éclat de lumière chaude qui traverse tout le village.",
  48: "Un à un, les habitants reprennent vie : le chat termine son saut, la théière finit de verser le thé, le moineau s'envole enfin.",
  49: "Odren, libéré de sa statue de pierre, pose une main fière sur l'épaule d'Elian : \"Tu as fini ce que je n'ai jamais eu le courage de terminer.\"",
  50: "Le village entier célèbre au coucher du soleil, les couleurs éclatantes après tant de gris. Elian range le grimoire réparé sur son étagère, non plus comme un fardeau mais comme une promesse : certaines histoires méritent d'être protégées, pas cachées. Épilogue : Sylvaine reste au village comme nouvelle gardienne aux côtés d'Elian, ouvrant la porte à une suite possible.",
};

const MILESTONE_CHAPTER_TITLES: Record<number, string> = {
  5: "La Nuit de l'Orage",
  10: "L'Ombre du Vieux Mage",
  15: "Premiers Signes d'Espoir",
  20: "L'Ombre Grandit",
  25: "Le Poids du Passé",
  30: "Les Souvenirs Gelés",
  35: "La Course contre le Temps",
  40: "Le Prix de la Vérité",
  45: "La Dernière Page",
  50: "Le Village Se Réveille",
};

const MILESTONE_ASSETS: Record<number, string> = {
  5: "/images/story/milestones/chapitre-1-page-5-colline.svg",
  10: "/images/story/milestones/chapitre-2-page-10-medailion.svg",
  15: "/images/story/milestones/chapitre-3-page-15-riviere.svg",
  20: "/images/story/milestones/chapitre-4-page-20-sylvaine.svg",
  25: "/images/story/milestones/chapitre-5-page-25-sceau.svg",
  30: "/images/story/milestones/chapitre-6-page-30-ciel.svg",
  35: "/images/story/milestones/chapitre-7-page-35-troisieme-sorcier.svg",
  40: "/images/story/milestones/chapitre-8-page-40-camarade.svg",
  45: "/images/story/milestones/chapitre-9-page-45-grimoire.svg",
  50: "/images/story/milestones/chapitre-10-page-50-fete.svg",
};

const IMAGE_PROMPTS: Record<number, string> = {
  1: "Illustration plate, village médiéval figé dans le temps, chat suspendu en plein saut, théière versant du thé immobile, palette bleu-gris givré, style conte.",
  2: "Jeune sorcier Elian, robe bleu marine, caressant un chat statufié ronronnant, village gelé en arrière-plan, illustration plate mélancolique.",
  3: "Page jaunie du grimoire portée par une brise glaciale aux pieds d'Elian, village figé, tons bleu-gris.",
  4: "Gros plan sur une page de grimoire avec écriture tremblante magique, lumière froide, style illustration plate.",
  5: "Elian sur une colline dominant un village entier figé sous un voile de givre bleuté jusqu'à l'horizon, serment solennel, illustration pleine largeur.",
  6: "Statue de pierre du vieux mage Odren à l'entrée d'une forêt gelée, regard fixe, Elian en bas, palette givrée.",
  7: "Page de grimoire coincée dans les branches gelées d'un pommier, Elian tend la main, illustration plate.",
  8: "Page effacée avec le mot TRAHISON visible, lumière inquiétante, Elian le visage tendu.",
  9: "Elian seul dans un village figé, frisson de doute, ombre menaçante au loin, palette froide.",
  10: "Médaillon brisé aux pieds de la statue d'Odren, moitié arrachée récemment, mystère, illustration majeure pleine largeur.",
  11: "Rayon de couleur traversant brièvement le ciel gris au-dessus du village, trois pages réunies brillent, espoir naissant.",
  12: "Moineau figé battant des ailes une fraction de seconde, Elian observant, magie qui pulse.",
  13: "Elian souriant pour la première fois, pages du grimoire autour de lui, lumière douce qui perce le gris.",
  14: "Page avec plan sommaire du grimoire sortie d'un puits du village, clocher au fond.",
  15: "Rivière du village dégelée sur quelques mètres, reflets du soleil couchant, village retenant son souffle, illustration majeure chaleureuse.",
  16: "Traces de pas fraîches dans la neige gelée d'un village immobile, tension, palette gris-bleu.",
  17: "Silhouette encapuchonnée s'échappant avec une page, Elian au premier plan, course dans le givre.",
  18: "Mot menaçant griffonné sur le sol enneigé, Elian lit, atmosphère inquiète.",
  19: "Page évoquant un Sceau Interdit, symboles magiques, lumière sombre.",
  20: "Sylvaine révélée à la torche, cape, visage partiel, Elian surpris, illustration majeure.",
  21: "Page tombée d'un coffre familial avec sceau de la famille d'Elian, intérieur de maison ancienne.",
  22: "Flashback suggestion du grand-père écrivant le grimoire, partie interdite, tons sépia froid.",
  23: "Elian réalisant que la déchirure n'était pas un accident, grimoire déchiré en main.",
  24: "Villageois à moitié dégelé murmurant Pardon, Elian penché vers lui, moment poignant.",
  25: "Elian comprenant le secret du Sceau Interdit, grand-père en ombre, Sylvaine en silhouette, illustration majeure.",
  26: "Éclair de souvenir en touchant une page, enfant du village, soir de la malédiction.",
  27: "Dispute entre Odren et jeune Sylvaine dans un souvenir, pouvoir trop grand, énergie magique.",
  28: "Page carbonisée décrivant un rituel de sacrifice, bords brûlés, gravité.",
  29: "Elian hésitant, pages autour de lui, ombre et lumière en balance.",
  30: "Elian déterminé sur la place du village, ciel s'éclaircissant, illustration majeure lumineuse.",
  31: "Sylvaine et Elian face à face, pages de grimoire en main, confrontation tendue.",
  32: "Sylvaine expliquant sa mission à Elian, respect naissant, village figé autour.",
  33: "Page s'envolant dans le vent glacé, Elian tendu pour la rattraper.",
  34: "Elian au sommet du clocher gelé, page coincée entre deux cloches immobiles.",
  35: "Sylvaine révélant le troisième sorcier, ombre menaçante, illustration majeure dramatique.",
  36: "Elian et Sylvaine unissant leurs forces, magie combinée, respect mutuel.",
  37: "Page du rituel final dans les caves, description du sacrifice, lumière de torche.",
  38: "Elian pensant à son grand-père, mélancolie et détermination.",
  39: "Explosion de givre noir au centre du village, troisième sorcier se manifeste.",
  40: "Visage révélé du camarade jaloux d'Odren, confrontation, illustration majeure.",
  41: "Place du village figée en cristal par le combat magique, silence suspendu.",
  42: "Sylvaine sacrifiant une page protégée, éclat magique repoussant l'attaque.",
  43: "Elian réalisant qu'il ne reste qu'une page, tension maximale.",
  44: "Dernière page nichée dans les racines de l'arbre le plus ancien, lumière sacrée.",
  45: "Grimoire presque complet dans les mains d'Elian, choix du sacrifice, illustration majeure.",
  46: "Elian sacrifiant sa peur, lumière intérieure, moment de vérité.",
  47: "Grimoire se refermant dans un éclat de lumière chaude traversant le village.",
  48: "Village qui reprend vie : chat finissant son saut, théière, moineau s'envolant.",
  49: "Odren posant sa main sur l'épaule d'Elian, fierté, statue libérée.",
  50: "Fête au coucher du soleil, village aux couleurs éclatantes, Elian et Sylvaine gardiens, épilogue ouvert, illustration finale majeure.",
};

function chapterForLevel(level: number): number {
  return Math.ceil(level / 5);
}

function vignetteAsset(level: number): string {
  return `/images/story/vignettes/chapitre-${chapterForLevel(level)}.svg`;
}

function buildBeat(level: number): StoryBeat {
  const isMilestone = level % 5 === 0;
  return {
    level,
    chapterTitle: isMilestone ? MILESTONE_CHAPTER_TITLES[level] : undefined,
    isMilestone,
    caption: CAPTIONS[level],
    imagePrompt: IMAGE_PROMPTS[level],
    imageAsset: isMilestone ? MILESTONE_ASSETS[level] : vignetteAsset(level),
    soundCue: isMilestone ? "major" : undefined,
  };
}

export const STORY_BEATS: StoryBeat[] = Array.from({ length: 50 }, (_, i) =>
  buildBeat(i + 1),
);

export function getStoryBeat(level: number): StoryBeat | undefined {
  return STORY_BEATS.find((b) => b.level === level);
}

export function getUnlockedBeats(
  storyLevelUnlocked: number,
  storyBeatsUnlocked: number[],
): StoryBeat[] {
  const seen = new Set(storyBeatsUnlocked);
  return STORY_BEATS.filter(
    (b) => seen.has(b.level) || b.level < storyLevelUnlocked,
  );
}
