import styles from '../styles/credits.module.scss'
import classes from 'classnames'

const Credits = ({ creditsOpen, loadAllModels, modelsLoaded, toggleCredits }) => {
  const handleLoadModels = () => {
    if (!modelsLoaded) loadAllModels()
  }

  return (
    <div className={classes(styles.modal, {
      [styles.open]: creditsOpen
    })}>
      <h1>Spring Scene</h1>
      <p>Credits etc...</p>
      <button
        className={classes(styles.load, {
          [styles.loaded]: modelsLoaded,
        })}
        onClick={handleLoadModels}
        disabled={modelsLoaded}
      >
        Load Models
      </button>
      <button className={styles.close} onClick={toggleCredits}>
        <div className={styles.bar1} />
        <div className={styles.bar2} />
      </button>
    </div>
  )
}

export default Credits
