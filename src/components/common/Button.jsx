import { Link } from 'react-router';
import styles from './Button.module.css';

// variant: 'primary' | 'secondary' | 'danger' | 'ghost' (DESIGN §3.4). Renders a Link when `to` is given.
export default function Button({ variant = 'secondary', to, className = '', ...props }) {
  const classes = `${styles.button} ${styles[variant]} ${className}`;
  if (to) {
    return <Link to={to} className={classes} {...props} />;
  }
  return <button type="button" className={classes} {...props} />;
}
