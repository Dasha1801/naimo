import clsx from 'clsx';
import { AlertCircle, BriefcaseBusiness, RefreshCw } from 'lucide-react';
import { ReactNode } from 'react';

import styles from './QueryState.module.scss';

type QueryStateType = 'loading' | 'error' | 'empty';

interface QueryStateProps {
  type: QueryStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  children?: ReactNode;
}

export function QueryState({ type, title, description, action, children }: QueryStateProps) {
  if (type === 'loading') {
    return (
      <div className={styles.skeletonList} aria-label="Загрузка" aria-busy="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonMain}>
              {/* Аватар компании */}
              <div className={styles.skeletonAvatar} />

              {/* Основная информация */}
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle} />

                <div className={styles.skeletonMeta}>
                  <div className={styles.skeletonCompany} />
                  <div className={styles.skeletonSeparator} />
                  <div className={styles.skeletonTime} />
                  <div className={styles.skeletonRemote} />
                </div>

                {/* AI Summary */}
                <div className={styles.skeletonSummary}>
                  <div className={styles.skeletonSummaryIcon} />
                  <div className={styles.skeletonSummaryText}>
                    <div />
                    <div />
                  </div>
                </div>

                {/* Теги */}
                <div className={styles.skeletonTags}>
                  <div className={styles.skeletonSource} />
                  <div className={styles.skeletonScore} />
                </div>
              </div>
            </div>

            {/* Зарплата */}
            <div className={styles.skeletonSalary}>
              <div className={styles.skeletonSalaryLabel} />
              <div className={styles.skeletonSalaryValue} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const isError = type === 'error';

  const Icon = isError ? AlertCircle : BriefcaseBusiness;

  return (
    <div
      className={clsx(styles.state, isError ? styles.error : styles.empty)}
      role={isError ? 'alert' : 'status'}
    >
      <div className={styles.icon}>
        <Icon size={28} />
      </div>

      <h3 className={styles.title}>{title || (isError ? 'Произошла ошибка' : 'Нет данных')}</h3>

      {description && <p className={styles.description}>{description}</p>}

      {children}

      {action && (
        <button
          type="button"
          className={styles.actionButton}
          onClick={action.onClick}
          disabled={action.loading}
        >
          <RefreshCw size={16} className={clsx(action.loading && styles.spinning)} />
          {action.loading ? 'Загрузка...' : action.label}
        </button>
      )}
    </div>
  );
}
