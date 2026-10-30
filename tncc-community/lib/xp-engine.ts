import { XPTransaction } from './types';

export interface XPSettings {
  postCreation: number;
  likeReceived: number;
  challengeParticipation: number;
  firstPlaceBonus: number;
  secondPlaceBonus: number;
  thirdPlaceBonus: number;
}

export const DEFAULT_XP_SETTINGS: XPSettings = {
  postCreation: 10,
  likeReceived: 2,
  challengeParticipation: 15,
  firstPlaceBonus: 100,
  secondPlaceBonus: 60,
  thirdPlaceBonus: 30,
};

export class XPEngine {
  private settings: XPSettings;

  constructor(customSettings?: Partial<XPSettings>) {
    this.settings = { ...DEFAULT_XP_SETTINGS, ...customSettings };
  }

  /**
   * Check if a transaction is a duplicate
   */
  public isDuplicateTransaction(
    existingTransactions: XPTransaction[],
    memberId: string,
    reason: string,
    referenceId?: string
  ): boolean {
    return existingTransactions.some(
      (tx) =>
        tx.member_id === memberId &&
        tx.reason === reason &&
        (referenceId ? tx.reference_id === referenceId : true)
    );
  }

  /**
   * Validate like XP: Self-likes do not award XP
   */
  public canEarnLikeXP(postAuthorId: string, likingMemberId: string): boolean {
    if (postAuthorId === likingMemberId) {
      return false; // Prevent self-like XP farming
    }
    return true;
  }

  public getPostCreationXP(): number {
    return this.settings.postCreation;
  }

  public getLikeReceivedXP(): number {
    return this.settings.likeReceived;
  }

  public getChallengeParticipationXP(): number {
    return this.settings.challengeParticipation;
  }

  public getWinnerBonusXP(position: 'first' | 'second' | 'third'): number {
    switch (position) {
      case 'first':
        return this.settings.firstPlaceBonus;
      case 'second':
        return this.settings.secondPlaceBonus;
      case 'third':
        return this.settings.thirdPlaceBonus;
      default:
        return 0;
    }
  }

  /**
   * Calculate member level based on total XP
   */
  public static calculateLevel(totalXp: number): {
    level: number;
    title: string;
    nextLevelXp: number;
    progressPercentage: number;
  } {
    if (totalXp < 100) {
      return { level: 1, title: 'Novice Creator', nextLevelXp: 100, progressPercentage: (totalXp / 100) * 100 };
    }
    if (totalXp < 300) {
      return { level: 2, title: 'Rising Artist', nextLevelXp: 300, progressPercentage: ((totalXp - 100) / 200) * 100 };
    }
    if (totalXp < 600) {
      return { level: 3, title: 'Skilled Maker', nextLevelXp: 600, progressPercentage: ((totalXp - 300) / 300) * 100 };
    }
    if (totalXp < 1200) {
      return { level: 4, title: 'Master Artisan', nextLevelXp: 1200, progressPercentage: ((totalXp - 600) / 600) * 100 };
    }
    return { level: 5, title: 'Tamil Nadu Elite Icon', nextLevelXp: 2000, progressPercentage: Math.min(100, ((totalXp - 1200) / 800) * 100) };
  }
}

export const xpEngine = new XPEngine();
