/**
 * User Segmentation - Advanced user categorization and targeting
 * Segments users based on behavior, intent, and value for personalized optimization
 */

export class UserSegmentation {
  constructor(analyticsManager, conversionTracker) {
    this.analyticsManager = analyticsManager;
    this.conversionTracker = conversionTracker;
    this.userSegments = new Map();
    this.segmentRules = new Map();
    this.userProfiles = new Map();
    this.segmentationEngine = null;
    this.isInitialized = false;
  }

  /**
   * Initialize user segmentation system
   */
  initialize() {
    if (this.isInitialized) return;

    this.setupDefaultSegments();
    this.setupSegmentationEngine();
    this.setupRealTimeSegmentation();
    this.loadExistingUserData();
    this.isInitialized = true;

    // User segmentation system initialized
  }

  /**
   * Setup default user segments
   */
  setupDefaultSegments() {
    // High-Value Segments
    this.segmentRules.set('high_value_leads', {
      name: 'High-Value Leads',
      criteria: {
        resume_download: true,
        case_study_complete: true,
        linkedin_click: true,
        min_session_time: 300, // 5 minutes
        min_scroll_depth: 75,
      },
      priority: 'critical',
      conversion_probability: 0.85,
    });

    this.segmentRules.set('engaged_researchers', {
      name: 'Engaged Researchers',
      criteria: {
        multiple_project_views: true,
        case_study_start: true,
        scroll_depth_75: true,
        min_session_time: 180, // 3 minutes
        min_page_views: 3,
      },
      priority: 'high',
      conversion_probability: 0.65,
    });

    // Medium-Value Segments
    this.segmentRules.set('casual_browsers', {
      name: 'Casual Browsers',
      criteria: {
        homepage_visit: true,
        min_scroll_depth: 25,
        max_session_time: 120, // 2 minutes
      },
      priority: 'medium',
      conversion_probability: 0.15,
    });

    this.segmentRules.set('contact_interested', {
      name: 'Contact Interested',
      criteria: {
        contact_page_visit: true,
        linkedin_click: true,
        min_session_time: 60, // 1 minute
      },
      priority: 'medium',
      conversion_probability: 0.4,
    });

    // Low-Value Segments
    this.segmentRules.set('bounce_visitors', {
      name: 'Bounce Visitors',
      criteria: {
        homepage_visit: true,
        max_scroll_depth: 25,
        max_session_time: 30, // 30 seconds
        single_page: true,
      },
      priority: 'low',
      conversion_probability: 0.02,
    });

    this.segmentRules.set('job_seekers', {
      name: 'Job Seekers',
      criteria: {
        resume_download: true,
        linkedin_click: true,
        min_session_time: 120, // 2 minutes
      },
      priority: 'high',
      conversion_probability: 0.7,
    });

    // Behavioral Segments
    this.segmentRules.set('power_users', {
      name: 'Power Users',
      criteria: {
        min_page_views: 5,
        min_session_time: 600, // 10 minutes
        multiple_case_studies: true,
        scroll_depth_90: true,
      },
      priority: 'critical',
      conversion_probability: 0.9,
    });

    this.segmentRules.set('mobile_users', {
      name: 'Mobile Users',
      criteria: {
        device_type: 'mobile',
        touch_interactions: true,
      },
      priority: 'medium',
      conversion_probability: 0.25,
    });

    this.segmentRules.set('returning_visitors', {
      name: 'Returning Visitors',
      criteria: {
        return_visit_count: { min: 2 },
        min_session_time: 90, // 1.5 minutes
      },
      priority: 'high',
      conversion_probability: 0.55,
    });
  }

  /**
   * Setup segmentation engine
   */
  setupSegmentationEngine() {
    this.segmentationEngine = {
      evaluateUser: userData => this.evaluateUserSegment(userData),
      getUserSegments: userId => this.getUserSegments(userId),
      updateUserProfile: (userId, data) => this.updateUserProfile(userId, data),
      getSegmentInsights: () => this.getSegmentInsights(),
      predictConversion: userId => this.predictUserConversion(userId),
    };
  }

  /**
   * Setup real-time segmentation
   */
  setupRealTimeSegmentation() {
    // Track user behavior in real-time
    this.trackUserBehavior();

    // Update segments based on new data
    this.setupSegmentUpdates();

    // Setup conversion prediction
    this.setupConversionPrediction();
  }

  /**
   * Track user behavior for segmentation
   */
  trackUserBehavior() {
    const userId = this.getOrCreateUserId();
    const userProfile =
      this.userProfiles.get(userId) || this.createEmptyUserProfile(userId);

    // Track page views
    const trackPageView = () => {
      userProfile.pageViews = (userProfile.pageViews || 0) + 1;
      userProfile.lastPageView = new Date().toISOString();
      userProfile.pagesVisited = userProfile.pagesVisited || [];
      userProfile.pagesVisited.push(window.location.pathname);

      this.updateUserProfile(userId, userProfile);
      this.evaluateAndUpdateSegments(userId, userProfile);
    };

    // Track initial page load
    trackPageView();

    // Track navigation
    window.addEventListener('popstate', trackPageView);

    // Track clicks and interactions
    document.addEventListener('click', e => {
      userProfile.totalClicks = (userProfile.totalClicks || 0) + 1;
      userProfile.lastInteraction = new Date().toISOString();

      // Track specific element interactions
      if (e.target.closest("a[href*='linkedin']")) {
        userProfile.linkedinClicks = (userProfile.linkedinClicks || 0) + 1;
      }
      if (e.target.closest("a[href*='resume'], a[href*='cv']")) {
        userProfile.resumeDownloads = (userProfile.resumeDownloads || 0) + 1;
      }

      this.updateUserProfile(userId, userProfile);
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        userProfile.maxScrollDepth = Math.max(
          userProfile.maxScrollDepth || 0,
          scrollPercent
        );
        this.updateUserProfile(userId, userProfile);
      }
    });

    // Track session time
    const sessionStart = Date.now();
    const updateSessionTime = () => {
      userProfile.sessionTime = Date.now() - sessionStart;
      this.updateUserProfile(userId, userProfile);
    };

    setInterval(updateSessionTime, 1000);

    // Track before unload
    window.addEventListener('beforeunload', () => {
      userProfile.lastSessionEnd = new Date().toISOString();
      this.updateUserProfile(userId, userProfile);
    });
  }

  /**
   * Get or create unique user ID
   */
  getOrCreateUserId() {
    let userId = localStorage.getItem('user_segmentation_id');

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_segmentation_id', userId);

      // Track new user
      this.analyticsManager.gtag('event', 'new_user_segmented', {
        event_category: 'Segmentation',
        user_id: userId,
      });
    }

    return userId;
  }

  /**
   * Create empty user profile
   */
  createEmptyUserProfile(userId) {
    return {
      userId,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visitCount: 1,
      pageViews: 0,
      sessionTime: 0,
      totalClicks: 0,
      maxScrollDepth: 0,
      segments: [],
      conversionProbability: 0,
      leadScore: 0,
      behaviorData: {
        linkedinClicks: 0,
        resumeDownloads: 0,
        caseStudyViews: 0,
        contactPageVisits: 0,
      },
    };
  }

  /**
   * Update user profile
   */
  updateUserProfile(userId, profile) {
    profile.lastUpdated = new Date().toISOString();
    this.userProfiles.set(userId, profile);

    // Persist to localStorage (in production, this would be server-side)
    try {
      localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profile));
    } catch (error) {
      console.warn('Could not persist user profile:', error);
    }
  }

  /**
   * Load existing user data
   */
  loadExistingUserData() {
    const userId = this.getOrCreateUserId();

    try {
      const storedProfile = localStorage.getItem(`user_profile_${userId}`);
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        profile.visitCount = (profile.visitCount || 0) + 1;
        profile.lastVisit = new Date().toISOString();
        this.userProfiles.set(userId, profile);
      }
    } catch (error) {
      console.warn('Could not load user profile:', error);
    }
  }

  /**
   * Evaluate user against segment criteria
   */
  evaluateUserSegment(userData) {
    const matchingSegments = [];

    for (const [segmentId, segment] of this.segmentRules) {
      if (this.matchesSegmentCriteria(userData, segment.criteria)) {
        matchingSegments.push({
          segmentId,
          segmentName: segment.name,
          priority: segment.priority,
          conversionProbability: segment.conversion_probability,
          matchedAt: new Date().toISOString(),
        });
      }
    }

    return matchingSegments;
  }

  /**
   * Check if user matches segment criteria
   */
  matchesSegmentCriteria(userData, criteria) {
    for (const [key, value] of Object.entries(criteria)) {
      if (!this.evaluateCriterion(userData, key, value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluate individual criterion
   */
  evaluateCriterion(userData, key, value) {
    const userValue = this.getNestedValue(userData, key);

    if (typeof value === 'object' && value !== null) {
      // Range criteria (min/max)
      if (value.min !== undefined && userValue < value.min) return false;
      if (value.max !== undefined && userValue > value.max) return false;
      return true;
    }

    // Direct comparison
    return userValue === value;
  }

  /**
   * Get nested value from user data
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Evaluate and update user segments
   */
  evaluateAndUpdateSegments(userId, userProfile) {
    const matchingSegments = this.evaluateUserSegment(userProfile);

    // Update user profile with new segments
    userProfile.segments = matchingSegments.map(s => s.segmentId);
    userProfile.conversionProbability = Math.max(
      ...matchingSegments.map(s => s.conversionProbability),
      0
    );

    // Calculate lead score
    userProfile.leadScore = this.calculateLeadScore(
      userProfile,
      matchingSegments
    );

    this.updateUserProfile(userId, userProfile);

    // Track segment changes
    if (matchingSegments.length > 0) {
      this.analyticsManager.gtag('event', 'segment_updated', {
        event_category: 'Segmentation',
        event_label: matchingSegments.map(s => s.segmentName).join(', '),
        user_id: userId,
        segment_count: matchingSegments.length,
        conversion_probability: userProfile.conversionProbability,
      });
    }

    return matchingSegments;
  }

  /**
   * Calculate lead score based on profile and segments
   */
  calculateLeadScore(userProfile, segments) {
    let score = 0;

    // Base score from behavior
    score += (userProfile.pageViews || 0) * 2;
    score += (userProfile.sessionTime || 0) / 60; // 1 point per minute
    score += (userProfile.maxScrollDepth || 0) * 0.5;
    score += (userProfile.totalClicks || 0) * 0.5;

    // Bonus from specific actions
    score += (userProfile.behaviorData?.linkedinClicks || 0) * 10;
    score += (userProfile.behaviorData?.resumeDownloads || 0) * 25;
    score += (userProfile.behaviorData?.caseStudyViews || 0) * 5;
    score += (userProfile.behaviorData?.contactPageVisits || 0) * 8;

    // Multiplier from segments
    const priorityMultiplier = {
      critical: 2.0,
      high: 1.5,
      medium: 1.0,
      low: 0.5,
    };

    const highestPriority = segments.reduce(
      (max, segment) =>
        priorityMultiplier[segment.priority] > priorityMultiplier[max]
          ? segment.priority
          : max,
      'low'
    );

    score *= priorityMultiplier[highestPriority];

    return Math.min(100, Math.round(score));
  }

  /**
   * Get user segments
   */
  getUserSegments(userId) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return [];

    return userProfile.segments || [];
  }

  /**
   * Predict user conversion probability
   */
  predictUserConversion(userId) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return 0;

    // Simple prediction based on current profile
    let probability = userProfile.conversionProbability || 0;

    // Adjust based on recent behavior
    const recentActivity =
      Date.now() -
      new Date(userProfile.lastInteraction || userProfile.firstVisit).getTime();
    const hoursSinceActivity = recentActivity / (1000 * 60 * 60);

    if (hoursSinceActivity < 1) {
      probability += 0.1; // Recent activity increases probability
    } else if (hoursSinceActivity > 24) {
      probability -= 0.2; // Old activity decreases probability
    }

    return Math.max(0, Math.min(1, probability));
  }

  /**
   * Get segment insights and analytics
   */
  getSegmentInsights() {
    const insights = {
      totalUsers: this.userProfiles.size,
      segmentDistribution: {},
      conversionBySegment: {},
      topPerformingSegments: [],
      segmentPerformance: {},
    };

    // Calculate segment distribution
    for (const [userId, profile] of this.userProfiles) {
      (profile.segments || []).forEach(segmentId => {
        insights.segmentDistribution[segmentId] =
          (insights.segmentDistribution[segmentId] || 0) + 1;
      });
    }

    // Calculate conversion rates by segment
    for (const [segmentId, rule] of this.segmentRules) {
      const segmentUsers = Array.from(this.userProfiles.values()).filter(
        profile => (profile.segments || []).includes(segmentId)
      );

      if (segmentUsers.length > 0) {
        const avgConversionProb =
          segmentUsers.reduce(
            (sum, user) => sum + (user.conversionProbability || 0),
            0
          ) / segmentUsers.length;

        insights.conversionBySegment[segmentId] = {
          name: rule.name,
          userCount: segmentUsers.length,
          avgConversionProbability: avgConversionProb,
          priority: rule.priority,
        };
      }
    }

    // Get top performing segments
    insights.topPerformingSegments = Object.entries(
      insights.conversionBySegment
    )
      .sort(
        ([, a], [, b]) =>
          b.avgConversionProbability - a.avgConversionProbability
      )
      .slice(0, 5);

    return insights;
  }

  /**
   * Setup segment updates based on events
   */
  setupSegmentUpdates() {
    // Listen for conversion events to update segments
    document.addEventListener('conversion_milestone', e => {
      const userId = this.getOrCreateUserId();
      const userProfile = this.userProfiles.get(userId);

      if (userProfile) {
        // Update conversion-related behavior
        const milestone = e.detail?.milestone;
        if (milestone) {
          userProfile.behaviorData = userProfile.behaviorData || {};
          userProfile.behaviorData[milestone] =
            (userProfile.behaviorData[milestone] || 0) + 1;
          this.updateUserProfile(userId, userProfile);
        }
      }
    });
  }

  /**
   * Setup conversion prediction
   */
  setupConversionPrediction() {
    // Update predictions every 30 seconds
    setInterval(() => {
      for (const [userId, profile] of this.userProfiles) {
        const newProbability = this.predictUserConversion(userId);
        if (
          Math.abs(newProbability - (profile.conversionProbability || 0)) > 0.05
        ) {
          profile.conversionProbability = newProbability;
          this.updateUserProfile(userId, profile);
        }
      }
    }, 30000);
  }

  /**
   * Export segmentation data
   */
  exportSegmentationData() {
    return {
      timestamp: new Date().toISOString(),
      segments: Object.fromEntries(this.segmentRules),
      userProfiles: Object.fromEntries(this.userProfiles),
      insights: this.getSegmentInsights(),
    };
  }

  /**
   * Get user targeting recommendations
   */
  getUserTargetingRecommendations(userId) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return [];

    const recommendations = [];
    const segments = userProfile.segments || [];

    // High-value user recommendations
    if (segments.includes('high_value_leads')) {
      recommendations.push({
        type: 'priority_support',
        message: 'Offer premium support and direct contact',
        priority: 'critical',
      });
    }

    // Engaged researcher recommendations
    if (segments.includes('engaged_researchers')) {
      recommendations.push({
        type: 'content_offer',
        message: 'Offer detailed case studies or whitepapers',
        priority: 'high',
      });
    }

    // Contact interested recommendations
    if (segments.includes('contact_interested')) {
      recommendations.push({
        type: 'contact_prompt',
        message: 'Show contact form or scheduling option',
        priority: 'high',
      });
    }

    // Returning visitor recommendations
    if (segments.includes('returning_visitors')) {
      recommendations.push({
        type: 'personalization',
        message: 'Show personalized content based on previous visits',
        priority: 'medium',
      });
    }

    return recommendations;
  }
}
