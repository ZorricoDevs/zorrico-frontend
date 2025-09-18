import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const ZorricoBlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      category: 'rates',
      title: 'Best Home Loan Interest Rates in India 2025 - Complete Guide',
      excerpt:
        "Discover the lowest home loan interest rates available in India for 2025. Compare rates from 50+ banks and NBFCs with Zorrico's unbiased platform.",
      content: (
        <div className='space-y-4 text-gray-700'>
          <h3 className='font-semibold text-lg'>Current Home Loan Interest Rates 2025:</h3>
          <div className='grid md:grid-cols-2 gap-4 text-sm'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-blue-700 mb-2'>Public Sector Banks</h4>
              <ul className='space-y-1'>
                <li>• SBI Home Loan: 8.50% - 9.25% p.a.</li>
                <li>• Bank of Baroda: 8.40% - 9.15% p.a.</li>
                <li>• Punjab National Bank: 8.55% - 9.30% p.a.</li>
                <li>• Canara Bank: 8.45% - 9.20% p.a.</li>
              </ul>
            </div>
            <div className='bg-green-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-green-700 mb-2'>Private Banks</h4>
              <ul className='space-y-1'>
                <li>• HDFC Bank: 8.60% - 9.50% p.a.</li>
                <li>• ICICI Bank: 8.65% - 9.55% p.a.</li>
                <li>• Axis Bank: 8.75% - 9.65% p.a.</li>
                <li>• Kotak Mahindra: 8.70% - 9.60% p.a.</li>
              </ul>
            </div>
          </div>
          <div className='bg-yellow-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-yellow-700 mb-2'>🔥 Zorrico Advantage</h4>
            <p className='text-sm'>
              Through our platform, eligible customers have secured rates as low as{' '}
              <strong>7.35% p.a.*</strong> by accessing exclusive deals from our partner banks and
              NBFCs.
            </p>
          </div>
          <h3 className='font-semibold'>Factors Affecting Your Interest Rate:</h3>
          <ul className='list-disc list-inside space-y-1 text-sm'>
            <li>
              <strong>Credit Score:</strong> 750+ gets best rates, 650-749 moderate rates
            </li>
            <li>
              <strong>Loan-to-Value Ratio:</strong> Lower LTV = better rates
            </li>
            <li>
              <strong>Income Stability:</strong> Salaried vs self-employed differences
            </li>
            <li>
              <strong>Employer Category:</strong> Government, PSU, MNC preferences
            </li>
            <li>
              <strong>Loan Amount:</strong> Higher amounts often get better rates
            </li>
            <li>
              <strong>Property Location:</strong> Tier 1 cities vs others
            </li>
          </ul>
        </div>
      ),
      keywords:
        'home loan interest rates 2025, best home loan rates india, lowest home loan interest rate, sbi hdfc icici home loan rates',
    },
    {
      id: 2,
      category: 'eligibility',
      title: 'Home Loan Eligibility Calculator - Free & Anonymous Check',
      excerpt:
        'Check your home loan eligibility instantly without affecting your credit score. Anonymous, accurate, and covers 50+ banks and NBFCs.',
      content: (
        <div className='space-y-4 text-gray-700'>
          <div className='bg-green-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-green-700 mb-2'>
              🎯 Zorrico Eligibility Checker Features
            </h4>
            <ul className='list-disc list-inside space-y-1 text-sm'>
              <li>
                <strong>100% Anonymous:</strong> No personal information required
              </li>
              <li>
                <strong>No Credit Impact:</strong> Check without affecting CIBIL score
              </li>
              <li>
                <strong>50+ Lenders:</strong> Compare eligibility across all major banks
              </li>
              <li>
                <strong>Instant Results:</strong> Get accurate results in under 30 seconds
              </li>
              <li>
                <strong>Detailed Analysis:</strong> Know exact loan amount, EMI, tenure options
              </li>
            </ul>
          </div>
          <h3 className='font-semibold'>Home Loan Eligibility Criteria in India:</h3>
          <div className='grid md:grid-cols-2 gap-4 text-sm'>
            <div>
              <h4 className='font-semibold text-blue-600 mb-2'>For Salaried Individuals:</h4>
              <ul className='space-y-1'>
                <li>• Age: 23-65 years</li>
                <li>• Minimum Income: ₹25,000/month</li>
                <li>• Work Experience: 2+ years</li>
                <li>• Current Job: 1+ year</li>
                <li>• Credit Score: 650+ (750+ preferred)</li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold text-purple-600 mb-2'>For Self-Employed:</h4>
              <ul className='space-y-1'>
                <li>• Age: 25-65 years</li>
                <li>• Business Vintage: 3+ years</li>
                <li>• ITR Filed: Last 2-3 years</li>
                <li>• Minimum Income: ₹50,000/month</li>
                <li>• Credit Score: 700+ preferred</li>
              </ul>
            </div>
          </div>
          <h3 className='font-semibold'>Eligibility Calculation Formula:</h3>
          <div className='bg-blue-50 p-4 rounded-lg text-sm'>
            <p>
              <strong>
                Maximum Loan Amount = (Monthly Income × EMI Multiplier) - Existing EMIs
              </strong>
            </p>
            <p className='mt-2'>Where EMI Multiplier varies from 40x to 60x based on:</p>
            <ul className='list-disc list-inside mt-1'>
              <li>Your income level and stability</li>
              <li>Credit score and history</li>
              <li>Age and retirement planning</li>
              <li>Employer category and profile</li>
            </ul>
          </div>
        </div>
      ),
      keywords:
        'home loan eligibility calculator, home loan eligibility criteria, anonymous eligibility checker, home loan eligibility india',
    },
    {
      id: 3,
      category: 'myths',
      title: 'Top 15 Home Loan Myths Debunked - Facts vs Fiction',
      excerpt:
        'Separate fact from fiction! We bust the most common home loan myths that prevent people from making informed decisions.',
      content: (
        <div className='space-y-4 text-gray-700'>
          <div className='space-y-4'>
            <div className='border-l-4 border-red-500 pl-4'>
              <h4 className='font-semibold text-red-600'>
                Myth 1: &ldquo;You need a 750+ credit score to get a home loan&rdquo;
              </h4>
              <p className='text-sm mt-1'>
                <strong>Reality:</strong> While 750+ gets you the best rates, loans are approved
                from 650+ score. Some banks approve even with 600+ for specific profiles.
              </p>
            </div>
            <div className='border-l-4 border-red-500 pl-4'>
              <h4 className='font-semibold text-red-600'>
                Myth 2: &ldquo;Public sector banks always have lower rates&rdquo;
              </h4>
              <p className='text-sm mt-1'>
                <strong>Reality:</strong> Private banks often offer competitive or better rates,
                especially for high-value loans. NBFCs can be most competitive for certain profiles.
              </p>
            </div>
            <div className='border-l-4 border-red-500 pl-4'>
              <h4 className='font-semibold text-red-600'>
                Myth 3: &ldquo;Checking eligibility affects your credit score&rdquo;
              </h4>
              <p className='text-sm mt-1'>
                <strong>Reality:</strong> Soft inquiries (like Zorrico&apos;s anonymous checker)
                don&apos;t impact your score. Only formal applications with hard inquiries affect
                credit scores.
              </p>
            </div>
            <div className='border-l-4 border-red-500 pl-4'>
              <h4 className='font-semibold text-red-600'>
                Myth 4: &ldquo;You can only get 80% financing&rdquo;
              </h4>
              <p className='text-sm mt-1'>
                <strong>Reality:</strong> Many banks offer up to 90% financing. Some even offer 95%
                for specific income categories or property types.
              </p>
            </div>
            <div className='border-l-4 border-red-500 pl-4'>
              <h4 className='font-semibold text-red-600'>
                Myth 5: &ldquo;Longer tenure always means lower EMI&rdquo;
              </h4>
              <p className='text-sm mt-1'>
                <strong>Reality:</strong> While EMI reduces, total interest paid increases
                significantly. Optimal tenure balances EMI affordability with total cost.
              </p>
            </div>
            <div className='border-l-4 border-red-500 pl-4'>
              <h4 className='font-semibold text-red-600'>
                Myth 6: &ldquo;Home loan interest rates are same everywhere&rdquo;
              </h4>
              <p className='text-sm mt-1'>
                <strong>Reality:</strong> Rates vary significantly based on your profile,
                relationship with bank, and negotiation skills. Zorrico helps find the best
                personalized rates.
              </p>
            </div>
          </div>
          <div className='bg-green-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-green-700'>💡 Zorrico Reality Check</h4>
            <p className='text-sm'>
              Our unbiased platform helps you separate myths from reality by providing transparent,
              data-driven insights from 50+ lenders. Make informed decisions, not assumption-based
              ones.
            </p>
          </div>
        </div>
      ),
      keywords: 'home loan myths, home loan facts, home loan misconceptions, home loan truth india',
    },
    {
      id: 4,
      category: 'unbiased',
      title: 'Why Choose Unbiased Home Loan Platforms Over Traditional Brokers',
      excerpt:
        'Discover the difference between biased traditional brokers and unbiased platforms like Zorrico. Make informed decisions with transparent data.',
      content: (
        <div className='space-y-4 text-gray-700'>
          <h3 className='font-semibold text-lg'>Traditional Brokers vs Unbiased Platforms:</h3>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='bg-red-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-red-700 mb-3'>❌ Traditional Broker Issues</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  • <strong>Commission Bias:</strong> Recommend banks paying highest commission
                </li>
                <li>
                  • <strong>Limited Options:</strong> Only partner banks, not entire market
                </li>
                <li>
                  • <strong>Hidden Charges:</strong> Processing fees, service charges not disclosed
                </li>
                <li>
                  • <strong>Pressure Tactics:</strong> Rush decisions without proper comparison
                </li>
                <li>
                  • <strong>Information Asymmetry:</strong> Keep you in dark about better options
                </li>
                <li>
                  • <strong>Post-Sale Service:</strong> Disappear after loan disbursement
                </li>
              </ul>
            </div>
            <div className='bg-green-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-green-700 mb-3'>✅ Zorrico Unbiased Approach</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  • <strong>Data-Driven:</strong> Recommendations based on your profile, not
                  commissions
                </li>
                <li>
                  • <strong>Complete Market Coverage:</strong> 50+ banks and NBFCs compared
                </li>
                <li>
                  • <strong>Transparent Pricing:</strong> All charges disclosed upfront
                </li>
                <li>
                  • <strong>No Pressure:</strong> Take time to make informed decisions
                </li>
                <li>
                  • <strong>Educational Content:</strong> Empower you with knowledge
                </li>
                <li>
                  • <strong>Ongoing Support:</strong> Lifetime relationship, not transaction-based
                </li>
              </ul>
            </div>
          </div>
          <h3 className='font-semibold'>The Zorrico Difference:</h3>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-700 mb-2'>🎯 Our Unbiased Algorithm</h4>
            <p className='text-sm mb-2'>Our proprietary matching algorithm considers:</p>
            <ul className='list-disc list-inside space-y-1 text-sm'>
              <li>Your exact financial profile and creditworthiness</li>
              <li>Current market rates and promotional offers</li>
              <li>Bank-specific eligibility criteria and approval rates</li>
              <li>Processing time and service quality metrics</li>
              <li>Total cost of loan including all hidden charges</li>
              <li>Post-disbursement service quality and customer support</li>
            </ul>
          </div>
          <h3 className='font-semibold'>Privacy-First Approach:</h3>
          <ul className='list-disc list-inside space-y-1 text-sm'>
            <li>
              <strong>Anonymous Checking:</strong> Check eligibility without sharing personal
              details
            </li>
            <li>
              <strong>Data Security:</strong> Bank-grade encryption and security protocols
            </li>
            <li>
              <strong>No Spam:</strong> We don&apos;t sell your data to third parties
            </li>
            <li>
              <strong>Consent-Based:</strong> You control when and how banks contact you
            </li>
          </ul>
        </div>
      ),
      keywords:
        'unbiased home loan platform, home loan broker vs platform, transparent home loan comparison, zorrico unbiased',
    },
    {
      id: 5,
      category: 'emi',
      title: 'Home Loan EMI Calculator - Complete Guide to EMI Planning',
      excerpt:
        'Master your home loan EMI calculations with our comprehensive guide. Understand EMI components, optimize tenure, and plan prepayments effectively.',
      content: (
        <div className='space-y-4 text-gray-700'>
          <h3 className='font-semibold text-lg'>Understanding EMI Components:</h3>
          <div className='bg-yellow-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-yellow-700 mb-2'>EMI = Principal + Interest</h4>
            <p className='text-sm'>
              <strong>Formula:</strong> EMI = [P × R × (1+R)^N] / [(1+R)^N-1]
            </p>
            <p className='text-sm mt-2'>
              Where: P = Loan Amount, R = Monthly Interest Rate, N = Number of months
            </p>
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-blue-700 mb-2'>EMI Optimization Strategies</h4>
              <ul className='space-y-1 text-sm'>
                <li>
                  • <strong>Higher Down Payment:</strong> Reduces loan amount and EMI
                </li>
                <li>
                  • <strong>Optimal Tenure:</strong> Balance EMI affordability with total interest
                </li>
                <li>
                  • <strong>Rate Shopping:</strong> 0.25% difference saves lakhs over tenure
                </li>
                <li>
                  • <strong>Co-applicant Benefits:</strong> Increase eligibility and reduce rates
                </li>
              </ul>
            </div>
            <div className='bg-green-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-green-700 mb-2'>EMI vs Income Guidelines</h4>
              <ul className='space-y-1 text-sm'>
                <li>
                  • <strong>Conservative:</strong> EMI ≤ 30% of gross income
                </li>
                <li>
                  • <strong>Moderate:</strong> EMI ≤ 40% of gross income
                </li>
                <li>
                  • <strong>Aggressive:</strong> EMI ≤ 50% of gross income
                </li>
                <li>
                  • <strong>Include:</strong> All existing EMIs in calculation
                </li>
              </ul>
            </div>
          </div>
          <h3 className='font-semibold'>EMI Examples for Different Loan Amounts:</h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-2 text-left'>Loan Amount</th>
                  <th className='px-4 py-2 text-left'>Rate</th>
                  <th className='px-4 py-2 text-left'>20 Years EMI</th>
                  <th className='px-4 py-2 text-left'>25 Years EMI</th>
                  <th className='px-4 py-2 text-left'>30 Years EMI</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b'>
                  <td className='px-4 py-2'>₹25 Lakhs</td>
                  <td className='px-4 py-2'>8.5%</td>
                  <td className='px-4 py-2'>₹21,785</td>
                  <td className='px-4 py-2'>₹19,650</td>
                  <td className='px-4 py-2'>₹18,223</td>
                </tr>
                <tr className='border-b'>
                  <td className='px-4 py-2'>₹50 Lakhs</td>
                  <td className='px-4 py-2'>8.5%</td>
                  <td className='px-4 py-2'>₹43,570</td>
                  <td className='px-4 py-2'>₹39,300</td>
                  <td className='px-4 py-2'>₹36,446</td>
                </tr>
                <tr className='border-b'>
                  <td className='px-4 py-2'>₹75 Lakhs</td>
                  <td className='px-4 py-2'>8.5%</td>
                  <td className='px-4 py-2'>₹65,355</td>
                  <td className='px-4 py-2'>₹58,950</td>
                  <td className='px-4 py-2'>₹54,669</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      keywords:
        'emi calculator home loan, home loan emi calculation, emi planning guide, home loan emi formula',
    },
    {
      id: 6,
      category: 'tips',
      title: 'Home Loan Application Process - Complete Step-by-Step Guide',
      excerpt:
        'Navigate the home loan application process like a pro. From documentation to disbursement, we cover everything you need to know.',
      content: (
        <div className='space-y-4 text-gray-700'>
          <h3 className='font-semibold text-lg'>Complete Home Loan Application Timeline:</h3>
          <div className='space-y-3'>
            <div className='flex items-start space-x-3'>
              <div className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold'>
                1
              </div>
              <div>
                <h4 className='font-semibold'>Pre-Application Research (1-2 weeks)</h4>
                <ul className='text-sm space-y-1 mt-1'>
                  <li>• Check credit score and improve if needed</li>
                  <li>• Use Zorrico&apos;s eligibility checker for accurate assessment</li>
                  <li>• Compare rates and terms across multiple lenders</li>
                  <li>• Shortlist 3-5 banks based on your profile</li>
                </ul>
              </div>
            </div>
            <div className='flex items-start space-x-3'>
              <div className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold'>
                2
              </div>
              <div>
                <h4 className='font-semibold'>Documentation Preparation (3-5 days)</h4>
                <ul className='text-sm space-y-1 mt-1'>
                  <li>• Income documents (salary slips, ITR, bank statements)</li>
                  <li>• Identity and address proofs</li>
                  <li>• Property documents (sale deed, NOC, approvals)</li>
                  <li>• Investment proofs for tax benefits</li>
                </ul>
              </div>
            </div>
            <div className='flex items-start space-x-3'>
              <div className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold'>
                3
              </div>
              <div>
                <h4 className='font-semibold'>Application Submission (1 day)</h4>
                <ul className='text-sm space-y-1 mt-1'>
                  <li>• Submit applications to shortlisted banks simultaneously</li>
                  <li>• Pay processing fees (refundable if loan rejected)</li>
                  <li>• Get acknowledgment and application number</li>
                </ul>
              </div>
            </div>
            <div className='flex items-start space-x-3'>
              <div className='bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold'>
                4
              </div>
              <div>
                <h4 className='font-semibold'>Bank Processing (7-15 days)</h4>
                <ul className='text-sm space-y-1 mt-1'>
                  <li>• Document verification and income assessment</li>
                  <li>• Credit appraisal and risk evaluation</li>
                  <li>• Property valuation and legal verification</li>
                  <li>• Technical and legal clearances</li>
                </ul>
              </div>
            </div>
            <div className='flex items-start space-x-3'>
              <div className='bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold'>
                5
              </div>
              <div>
                <h4 className='font-semibold'>Sanction and Disbursement (5-10 days)</h4>
                <ul className='text-sm space-y-1 mt-1'>
                  <li>• Loan sanction letter with final terms</li>
                  <li>• Legal documentation and agreement signing</li>
                  <li>• Insurance formalities completion</li>
                  <li>• Disbursement to seller/builder account</li>
                </ul>
              </div>
            </div>
          </div>
          <div className='bg-orange-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-orange-700 mb-2'>⚡ Pro Tips for Faster Approval</h4>
            <ul className='list-disc list-inside space-y-1 text-sm'>
              <li>Apply to multiple banks simultaneously for better negotiation power</li>
              <li>Maintain 6-month average balance as per bank&apos;s requirement</li>
              <li>Choose properties in bank&apos;s approved projects for faster processing</li>
              <li>Consider co-applicant to increase eligibility and approval chances</li>
              <li>Use Zorrico&apos;s verified documentation checklist to avoid delays</li>
            </ul>
          </div>
        </div>
      ),
      keywords:
        'home loan application process, home loan documentation, home loan approval process, home loan disbursement',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    {
      id: 'rates',
      name: 'Interest Rates',
      count: blogPosts.filter(p => p.category === 'rates').length,
    },
    {
      id: 'eligibility',
      name: 'Eligibility',
      count: blogPosts.filter(p => p.category === 'eligibility').length,
    },
    {
      id: 'myths',
      name: 'Myths & Facts',
      count: blogPosts.filter(p => p.category === 'myths').length,
    },
    {
      id: 'unbiased',
      name: 'Unbiased Platform',
      count: blogPosts.filter(p => p.category === 'unbiased').length,
    },
    { id: 'emi', name: 'EMI Planning', count: blogPosts.filter(p => p.category === 'emi').length },
    {
      id: 'tips',
      name: 'Tips & Guides',
      count: blogPosts.filter(p => p.category === 'tips').length,
    },
  ];

  const filteredPosts =
    activeCategory === 'all'
      ? blogPosts
      : blogPosts.filter(post => post.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Zorrico Home Loan Blog - Expert Tips, Best Rates & Unbiased Reviews 2025</title>
        <meta
          name='description'
          content='Comprehensive home loan guidance from Zorrico experts. Latest interest rates, eligibility tips, EMI planning, myth-busting, and unbiased comparisons from 50+ banks in India.'
        />
        <meta
          name='keywords'
          content='zorrico blog, home loan blog india, best home loan rates 2025, home loan eligibility calculator, unbiased home loan comparison, home loan myths, emi calculator, home loan tips, mortgage advice india, home loan interest rates, anonymous eligibility checker'
        />
        <link rel='canonical' href='https://zorrico.com/blog' />
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Zorrico Home Loan Blog',
            description: 'Expert home loan advice, latest interest rates, and unbiased comparisons',
            url: 'https://zorrico.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Zorrico',
              url: 'https://zorrico.com',
            },
          })}
        </script>
      </Helmet>

      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='container mx-auto px-4 py-12'>
          <div className='max-w-6xl mx-auto'>
            {/* Header Section */}
            <div className='text-center mb-12'>
              <h1 className='text-5xl font-bold text-gray-900 mb-4'>Zorrico Home Loan Blog</h1>
              <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                Your complete guide to home loans in India. Get expert insights, latest rates,
                unbiased comparisons, and actionable tips from India&apos;s leading home loan
                platform.
              </p>
            </div>

            {/* Category Filter */}
            <div className='flex flex-wrap justify-center gap-2 mb-8'>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className='grid gap-8 lg:grid-cols-2'>
              {filteredPosts.map(post => (
                <article
                  key={post.id}
                  className='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow'
                >
                  <div className='mb-4'>
                    <span className='inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-3'>
                      {categories.find(c => c.id === post.category)?.name || post.category}
                    </span>
                    <h2 className='text-2xl font-semibold mb-3 text-gray-900 leading-tight'>
                      {post.title}
                    </h2>
                    <p className='text-gray-600 mb-4'>{post.excerpt}</p>
                    <div className='text-sm text-gray-500 mb-4'>
                      Published: September 18, 2025 | By Zorrico Expert Team
                    </div>
                  </div>
                  <div className='border-t pt-4'>{post.content}</div>
                  <div className='mt-6 pt-4 border-t'>
                    <div className='flex items-center justify-between'>
                      <div className='text-xs text-gray-500'>Keywords: {post.keywords}</div>
                      <div className='flex space-x-3'>
                        <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                          Share
                        </button>
                        <button className='text-green-600 hover:text-green-800 text-sm font-medium'>
                          Check Eligibility
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* SEO Footer Content */}
            <div className='mt-12 p-8 bg-white rounded-lg shadow-lg'>
              <h3 className='text-2xl font-bold mb-4 text-gray-900'>
                About Zorrico - Your Trusted Home Loan Partner
              </h3>
              <div className='prose prose-lg text-gray-700'>
                <p>
                  <strong>Zorrico</strong> is India&apos;s leading home loan platform that makes the
                  home loan process effortless and unbiased. Our mission is to democratize access to
                  the best home loan deals by providing transparent, data-driven recommendations
                  from over 50 banks and financial institutions.
                </p>
                <p>
                  Founded with the vision of &ldquo;From Finding Homes to Making Them Yours,&rdquo;
                  Zorrico serves customers, brokers, builders, and banks with cutting-edge
                  technology that prioritizes privacy and user experience.
                </p>
                <div className='grid md:grid-cols-3 gap-6 mt-6'>
                  <div>
                    <h4 className='font-semibold text-blue-600'>For Customers</h4>
                    <p className='text-sm'>
                      Anonymous eligibility checking, best rate comparison, and personalized
                      recommendations.
                    </p>
                  </div>
                  <div>
                    <h4 className='font-semibold text-green-600'>For Brokers</h4>
                    <p className='text-sm'>
                      Advanced tools, lead management, and commission tracking platform.
                    </p>
                  </div>
                  <div>
                    <h4 className='font-semibold text-purple-600'>For Builders</h4>
                    <p className='text-sm'>
                      Integrated financing solutions and customer acquisition tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZorricoBlogPage;
