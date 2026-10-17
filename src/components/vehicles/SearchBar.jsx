import styles from './SearchBar.module.css';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Plate, make, model or driver…',
  label = 'Search vehicles',
}) {
  return (
    <div className={styles.search}>
      <label htmlFor="vehicle-search" className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <span className={styles.icon} aria-hidden="true">
          🔍
        </span>
        <input
          id="vehicle-search"
          type="search"
          className={`input ${styles.input}`}
          value={value}
          placeholder={placeholder}
          maxLength={50}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button type="button" className={styles.clear} aria-label="Clear search" onClick={() => onChange('')}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
