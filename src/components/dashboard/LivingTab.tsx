'use client';

import type { LivingDetails } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface LivingTabProps {
  living: LivingDetails;
}

interface BudgetRow {
  label: string;
  amount: number;
}

export function LivingTab({ living }: LivingTabProps) {
  const { costOfLivingIndex, medianRent1br, medianRent2br, housingListings, sampleBudget } = living;

  const budgetRows: BudgetRow[] = [
    { label: 'Rent', amount: sampleBudget.rent },
    { label: 'Groceries', amount: sampleBudget.groceries },
    { label: 'Utilities', amount: sampleBudget.utilities },
    { label: 'Transportation', amount: sampleBudget.transportation },
    { label: 'Discretionary', amount: sampleBudget.discretionary },
  ];

  const maxBudgetAmount = Math.max(...budgetRows.map((r) => r.amount));

  return (
    <div className="space-y-6">
      {/* Cost overview */}
      <section>
        <h3 className="font-display text-base font-semibold text-charcoal">Cost of Living</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Card>
            <p className="text-xs text-charcoal/50">Cost Index</p>
            <p className="mt-1 text-xl font-semibold text-charcoal">{costOfLivingIndex}</p>
            <p className="text-xs text-charcoal/40">100 = national avg</p>
          </Card>
          <Card>
            <p className="text-xs text-charcoal/50">Median Rent (1BR)</p>
            <p className="mt-1 text-xl font-semibold text-charcoal">{formatCurrency(medianRent1br)}</p>
          </Card>
          <Card>
            <p className="text-xs text-charcoal/50">Median Rent (2BR)</p>
            <p className="mt-1 text-xl font-semibold text-charcoal">{formatCurrency(medianRent2br)}</p>
          </Card>
        </div>
      </section>

      {/* Housing listings */}
      {housingListings.length > 0 && (
        <section>
          <h3 className="font-display text-base font-semibold text-charcoal">Housing Listings</h3>
          <div className="mt-3 space-y-3">
            {housingListings.map((listing, index) => (
              <Card key={`${listing.url}-${index}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-charcoal">{listing.title}</h4>
                    <p className="mt-0.5 text-xs text-charcoal/50">
                      {listing.bedrooms}BR -- {listing.neighborhood}
                    </p>
                  </div>
                  <span className="shrink-0 text-base font-semibold text-terracotta">
                    {formatCurrency(listing.price)}/mo
                  </span>
                </div>
                <a
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-terracotta hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  View listing
                </a>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Monthly budget */}
      <section>
        <h3 className="font-display text-base font-semibold text-charcoal">Monthly Budget</h3>
        <Card className="mt-3">
          <div className="space-y-3">
            {budgetRows.map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal/70">{row.label}</span>
                  <span className="font-medium text-charcoal">{formatCurrency(row.amount)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-charcoal/5">
                  <div
                    className="h-full rounded-full bg-terracotta/60 transition-all"
                    style={{ width: `${maxBudgetAmount > 0 ? (row.amount / maxBudgetAmount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-charcoal/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-charcoal">Total</span>
              <span className="text-base font-semibold text-charcoal">{formatCurrency(sampleBudget.total)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-charcoal/50">Estimated Salary</span>
              <span className="text-charcoal/70">{formatCurrency(sampleBudget.estimatedSalary)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-charcoal/50">Savings Rate</span>
              <span className="font-medium text-sage">{Math.round(sampleBudget.savingsRate * 100)}%</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
