const { analyzeCompatibility } = require('./aiMatchingService');

// Utility functions
const calculateOverlap = (array1, array2) => {
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  return intersection.size / Math.max(set1.size, set2.size);
};

const calculateScheduleCompatibility = (availability1, availability2) => {
  const daysOverlap = calculateOverlap(availability1.preferredDays, availability2.preferredDays);
  const timesOverlap = calculateOverlap(availability1.preferredTimes, availability2.preferredTimes);
  return (daysOverlap + timesOverlap) / 2;
};

const calculateMethodCompatibility = (preferences1, preferences2) => {
  const teachingMethodMatch = preferences1.teachingMethod === preferences2.learningMethod;
  const learningMethodMatch = preferences1.learningMethod === preferences2.teachingMethod;
  return (teachingMethodMatch + learningMethodMatch) / 2;
};

// Content-based filtering
const contentBasedMatching = (user1, user2) => {
  const teachingOverlap = calculateOverlap(user1.subjects.teaching, user2.subjects.learning);
  const learningOverlap = calculateOverlap(user1.subjects.learning, user2.subjects.teaching);
  const scheduleScore = calculateScheduleCompatibility(user1.availability, user2.availability);
  const methodScore = calculateMethodCompatibility(user1.preferences, user2.preferences);
  
  const totalScore = (teachingOverlap * 0.4 + learningOverlap * 0.4 + scheduleScore * 0.1 + methodScore * 0.1) * 100;
  
  return {
    score: totalScore,
    details: {
      teachingOverlap: teachingOverlap * 100,
      learningOverlap: learningOverlap * 100,
      scheduleScore: scheduleScore * 100,
      methodScore: methodScore * 100
    }
  };
};

// Collaborative filtering
const createUserSubjectMatrix = (users) => {
  const matrix = {};
  users.forEach(user => {
    matrix[user._id] = {
      teaching: user.subjects.teaching,
      learning: user.subjects.learning
    };
  });
  return matrix;
};

const calculatePearsonCorrelation = (user1, user2) => {
  const commonSubjects = new Set([
    ...user1.subjects.teaching,
    ...user1.subjects.learning,
    ...user2.subjects.teaching,
    ...user2.subjects.learning
  ]);

  let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
  let n = 0;

  commonSubjects.forEach(subject => {
    const user1Score = user1.subjects.teaching.includes(subject) ? 1 : 
                      user1.subjects.learning.includes(subject) ? 0.5 : 0;
    const user2Score = user2.subjects.teaching.includes(subject) ? 1 :
                      user2.subjects.learning.includes(subject) ? 0.5 : 0;

    sum1 += user1Score;
    sum2 += user2Score;
    sum1Sq += user1Score ** 2;
    sum2Sq += user2Score ** 2;
    pSum += user1Score * user2Score;
    n++;
  });

  if (n === 0) return 0;

  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 ** 2 / n) * (sum2Sq - sum2 ** 2 / n));

  return den === 0 ? 0 : num / den;
};

// Hybrid matching algorithm
const hybridMatching = async (user, potentialMatches) => {
  const results = await Promise.all(potentialMatches.map(async (match) => {
    // Content-based score
    const contentScore = contentBasedMatching(user, match);
    
    // Collaborative score
    const collaborativeScore = calculatePearsonCorrelation(user, match) * 100;
    
    // AI analysis
    const aiAnalysis = await analyzeCompatibility(user, match);
    
    // Combine scores with weights
    const finalScore = (
      contentScore.score * 0.4 +
      collaborativeScore * 0.3 +
      aiAnalysis.compatibilityScore * 0.3
    );
    
    return {
      user: match,
      score: finalScore,
      details: {
        contentBased: contentScore,
        collaborative: collaborativeScore,
        aiAnalysis: aiAnalysis
      }
    };
  }));

  // Sort by final score
  results.sort((a, b) => b.score - a.score);
  
  return results;
};

// Main matching function
const findMatches = async (user, potentialMatches, options = {}) => {
  const {
    algorithm = 'hybrid',
    limit = 5,
    minScore = 60
  } = options;

  let results;
  
  switch (algorithm) {
    case 'content':
      results = potentialMatches.map(match => ({
        user: match,
        ...contentBasedMatching(user, match)
      }));
      break;
      
    case 'collaborative':
      results = potentialMatches.map(match => ({
        user: match,
        score: calculatePearsonCorrelation(user, match) * 100
      }));
      break;
      
    case 'hybrid':
    default:
      results = await hybridMatching(user, potentialMatches);
      break;
  }

  // Filter by minimum score and limit results
  return results
    .filter(result => result.score >= minScore)
    .slice(0, limit);
};

module.exports = {
  findMatches,
  contentBasedMatching,
  calculatePearsonCorrelation,
  hybridMatching
}; 