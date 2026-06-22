import { supabase } from "./supabaseClient";

export type Profile = {
  id: string;
  email: string;
  firstname: string;
  created_at: string;
};

export type Exercise = {
  slug: string;
  title: string;
  category: string;
  total_steps: number;
  href: string;
};

export type ProgressRecord = {
  exercise_slug: string;
  status: string;
  completion: number;
  updated_at: string;
};

export const PASSPORT_CATEGORIES = [
  "Mindset & Organisation",
  "Parlez-vous le Marketing ?",
  "Dompter l'Algo",
  "La Reine du Script",
  "L'As de la Négociation",
  "Objectif Sold Out",
  "Zéro Retouche",
  "Fin du cahier",
] as const;

export const EXERCISES: Exercise[] = [
  {
    slug: "mindset-lettre-septembre",
    title: "Exercice — La Lettre à la Toi de septembre (Terry)",
    category: "Mindset & Organisation",
    total_steps: 1,
    href: "/mindset/lettre-septembre",
  },
];

const PROFILE_KEY = "yougc-summer-camp-profile";
const PENDING_PROFILE_KEY = "yougc-summer-camp-pending-profile";
const PROGRESS_KEY = "yougc-summer-camp-progress";
const ANSWERS_KEY = "yougc-summer-camp-answers";

type StoredAnswer = {
  exercise_slug: string;
  letter: string;
  updated_at: string;
};

function hasBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasBrowserStorage()) {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (hasBrowserStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export async function startEmailLogin(firstname: string, email: string) {
  const cleanFirstname = firstname.trim();
  const cleanEmail = email.trim().toLowerCase();
  const pendingProfile = {
    firstname: cleanFirstname,
    email: cleanEmail,
  };

  writeJson(PENDING_PROFILE_KEY, pendingProfile);

  if (!supabase) {
    const profile: Profile = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      firstname: cleanFirstname,
      created_at: new Date().toISOString(),
    };

    writeJson(PROFILE_KEY, profile);
    return { needsEmailConfirmation: false };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      data: {
        firstname: cleanFirstname,
      },
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    throw error;
  }

  return { needsEmailConfirmation: true };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!supabase) {
    return readJson<Profile | null>(PROFILE_KEY, null);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const pendingProfile = readJson<Partial<Profile> | null>(
    PENDING_PROFILE_KEY,
    null,
  );
  const firstname =
    typeof user.user_metadata.firstname === "string"
      ? user.user_metadata.firstname
      : pendingProfile?.firstname || user.email.split("@")[0];

  const profileToSave = {
    id: user.id,
    email: user.email.toLowerCase(),
    firstname,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileToSave, { onConflict: "id" })
    .select("id,email,firstname,created_at")
    .single();

  if (error) {
    throw error;
  }

  if (hasBrowserStorage()) {
    window.localStorage.removeItem(PENDING_PROFILE_KEY);
  }

  return data as Profile;
}

export async function getProgressRecords(
  userId: string,
): Promise<ProgressRecord[]> {
  if (!supabase) {
    return readJson<Record<string, ProgressRecord[]>>(PROGRESS_KEY, {})[userId] || [];
  }

  const { data, error } = await supabase
    .from("progress")
    .select("exercise_slug,status,completion,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as ProgressRecord[];
}

export function getGlobalCompletion(progressRecords: ProgressRecord[]) {
  if (EXERCISES.length === 0) {
    return 0;
  }

  const completedExercises = EXERCISES.filter((exercise) => {
    const record = progressRecords.find(
      (progress) => progress.exercise_slug === exercise.slug,
    );

    return record && record.completion >= 100 && record.status === "terminé";
  });

  return (completedExercises.length / EXERCISES.length) * 100;
}

export function getLastActivity(progressRecords: ProgressRecord[]) {
  const [latestProgress] = [...progressRecords].sort(
    (left, right) =>
      new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
  );

  if (!latestProgress) {
    return null;
  }

  const exercise = EXERCISES.find(
    (item) => item.slug === latestProgress.exercise_slug,
  );

  return {
    title: exercise?.title || latestProgress.exercise_slug,
    updatedAt: latestProgress.updated_at,
  };
}

export function getCategoryProgress(progressRecords: ProgressRecord[]) {
  return PASSPORT_CATEGORIES.map((category) => {
    const categoryExercises = EXERCISES.filter(
      (exercise) => exercise.category === category,
    );
    const completed = categoryExercises.filter((exercise) => {
      const record = progressRecords.find(
        (progress) => progress.exercise_slug === exercise.slug,
      );

      return record && record.completion >= 100 && record.status === "terminé";
    }).length;

    return {
      title: category,
      completed,
      total: categoryExercises.length,
    };
  });
}

export function getExerciseCompletion(
  progressRecords: ProgressRecord[],
  slug: string,
) {
  return (
    progressRecords.find((progress) => progress.exercise_slug === slug)
      ?.completion || 0
  );
}

export async function getLetterAnswer(userId: string) {
  if (!supabase) {
    const answers = readJson<Record<string, StoredAnswer[]>>(ANSWERS_KEY, {});
    const answer = answers[userId]?.find(
      (item) => item.exercise_slug === "mindset-lettre-septembre",
    );

    return answer?.letter || "";
  }

  const { data, error } = await supabase
    .from("answers")
    .select("content")
    .eq("user_id", userId)
    .eq("exercise_slug", "mindset-lettre-septembre")
    .maybeSingle();

  if (error) {
    throw error;
  }

  const content = data?.content as { letter?: string } | null;

  return content?.letter || "";
}

export async function saveLetterAnswer(userId: string, letter: string) {
  const updatedAt = new Date().toISOString();
  const completion = letter.trim().length > 0 ? 100 : 0;
  const status = completion === 100 ? "terminé" : "brouillon";

  if (!supabase) {
    const allAnswers = readJson<Record<string, StoredAnswer[]>>(ANSWERS_KEY, {});
    const userAnswers = allAnswers[userId] || [];
    const answerIndex = userAnswers.findIndex(
      (item) => item.exercise_slug === "mindset-lettre-septembre",
    );
    const nextAnswer = {
      exercise_slug: "mindset-lettre-septembre",
      letter,
      updated_at: updatedAt,
    };

    if (answerIndex >= 0) {
      userAnswers[answerIndex] = nextAnswer;
    } else {
      userAnswers.push(nextAnswer);
    }

    writeJson(ANSWERS_KEY, {
      ...allAnswers,
      [userId]: userAnswers,
    });

    const allProgress = readJson<Record<string, ProgressRecord[]>>(
      PROGRESS_KEY,
      {},
    );
    const userProgress = allProgress[userId] || [];
    const progressIndex = userProgress.findIndex(
      (item) => item.exercise_slug === "mindset-lettre-septembre",
    );
    const nextProgress = {
      exercise_slug: "mindset-lettre-septembre",
      status,
      completion,
      updated_at: updatedAt,
    };

    if (progressIndex >= 0) {
      userProgress[progressIndex] = nextProgress;
    } else {
      userProgress.push(nextProgress);
    }

    writeJson(PROGRESS_KEY, {
      ...allProgress,
      [userId]: userProgress,
    });

    return;
  }

  const { data: existingAnswer, error: answerLookupError } = await supabase
    .from("answers")
    .select("id")
    .eq("user_id", userId)
    .eq("exercise_slug", "mindset-lettre-septembre")
    .maybeSingle();

  if (answerLookupError) {
    throw answerLookupError;
  }

  const answerPayload = {
    user_id: userId,
    exercise_slug: "mindset-lettre-septembre",
    content: { letter },
    updated_at: updatedAt,
  };

  if (existingAnswer?.id) {
    const { error } = await supabase
      .from("answers")
      .update(answerPayload)
      .eq("id", existingAnswer.id);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("answers").insert(answerPayload);

    if (error) {
      throw error;
    }
  }

  const { data: existingProgress, error: progressLookupError } = await supabase
    .from("progress")
    .select("id")
    .eq("user_id", userId)
    .eq("exercise_slug", "mindset-lettre-septembre")
    .maybeSingle();

  if (progressLookupError) {
    throw progressLookupError;
  }

  const progressPayload = {
    user_id: userId,
    exercise_slug: "mindset-lettre-septembre",
    status,
    completion,
    updated_at: updatedAt,
  };

  if (existingProgress?.id) {
    const { error } = await supabase
      .from("progress")
      .update(progressPayload)
      .eq("id", existingProgress.id);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("progress").insert(progressPayload);

    if (error) {
      throw error;
    }
  }
}
