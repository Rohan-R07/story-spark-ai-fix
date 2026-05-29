import { User } from "../user/user.model";

const ensureGamification = (user: any) => {
  if (!user.gamification) {
    user.gamification = {
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      lastActiveDate: null,
    };
  }
};

const updateDailyStreak = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) return;

    ensureGamification(user);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();

    let lastActive = user.gamification.lastActiveDate;

    // First login
    if (!lastActive) {
      user.gamification.streak = 1;
      user.gamification.lastActiveDate = now;

      await addXp(user, 10);

      await user.save();

      return;
    }

    const lastActiveDate = new Date(lastActive);
    lastActiveDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastActiveDate.getTime();

    const diffDays = Math.round(
      diffTime / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Logged in yesterday
      user.gamification.streak += 1;
      user.gamification.lastActiveDate = now;

      await addXp(user, 10);

      await user.save();
    } else if (diffDays > 1) {
      // Missed a day
      user.gamification.streak = 1;
      user.gamification.lastActiveDate = now;

      await addXp(user, 10);

      await user.save();
    }
  } catch (error) {
    console.error("Error updating daily streak:", error);
  }
};

const addXp = async (
  user: any,
  amount: number
) => {
  try {
    ensureGamification(user);

    const currentXp =
      user.gamification.xp || 0;

    const newXp = currentXp + amount;

    // Level formula
    const newLevel =
      Math.floor(Math.sqrt(newXp / 100)) + 1;

    user.gamification.xp = newXp;

    if (newLevel > user.gamification.level) {
      user.gamification.level = newLevel;
    }
  } catch (error) {
    console.error("Error adding XP:", error);
  }
};

const awardBadge = async (
  userId: string,
  badgeName: string
) => {
  try {
    const user = await User.findById(userId);

    if (!user) return;

    ensureGamification(user);

    if (
      !user.gamification.badges.includes(
        badgeName
      )
    ) {
      user.gamification.badges.push(
        badgeName
      );

      await user.save();
    }
  } catch (error) {
    console.error("Error awarding badge:", error);
  }
};

export const GamificationService = {
  updateDailyStreak,
  addXp,
  awardBadge,
};