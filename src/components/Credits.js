import styles from '../styles/credits.module.scss'
import classes from 'classnames'

const Credits = ({
  creditsOpen,
  loadAllModels,
  modelsLoaded,
  toggleCredits,
}) => {
  const handleLoadModels = () => {
    if (!modelsLoaded) loadAllModels()
  }

  return (
    <div
      className={classes(styles.modal, {
        [styles.open]: creditsOpen,
      })}
    >
      <h1>Spring Scene</h1>
      <div>
        <p>
          Take a virtual Spring Break and enter this 3D web app built for{' '}
          <a href='https://mintbean.io/' target='_blank'>
            Mintbean
          </a>
          's weekly hackathon. The requirements were to build a 3D scene using{' '}
          <a href='https://threejs.org/' target='_blank'>
            Three.js
          </a>{' '}
          and free models found online. This app is also built using{' '}
          <a href='https://nextjs.org/' target='_blank'>
            Next.js
          </a>{' '}
          with animations powered by{' '}
          <a href='https://greensock.com/gsap/' target='_blank'>
            GSAP
          </a>
          .
        </p>
        <div className={styles.row}>
          <div className={styles.col}>
            <h2>How to Use the App</h2>
            <ul>
              <li>Play or pause sound in upper left corner</li>
              <li>Scroll to zoom and drag to rotate the scene</li>
              <li>Hover over flowers to animate them</li>
              <li>Find the flower that scares the bunny away!</li>
            </ul>
          </div>
          <div className={styles.col}>
            <h2>Connect With Me</h2>
            <ul className={styles.connect}>
              <li className={styles.portfolio}>
                <a href='https://delilahclement.dev/' target='_blank'>
                  Portfolio Site
                </a>
              </li>
              <li className={styles.linkedin}>
                <a
                  href='https://www.linkedin.com/in/delilahclement/'
                  target='_blank'
                >
                  LinkedIn
                </a>
              </li>
              <li className={styles.github}>
                <a href='https://github.com/goplayoutside3' target='_blank'>
                  Github
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <h2>Credits</h2>
            <ul>
              <li>
                Rabbit by{' '}
                <a href='https://sketchfab.com/FourthGreen' target='_blank'>
                  FourthGreen
                </a>{' '}
                on Sketchfab
              </li>
              <li>
                Grass by{' '}
                <a href='https://sketchfab.com/qewr1324' target='_blank'>
                  F A L C O N
                </a>{' '}
                on Sketchfab
              </li>
              <li>
                Flowers by{' '}
                <a
                  href='https://free3d.com/user/printable_models'
                  target='_blank'
                >
                  printable_models
                </a>{' '}
                on Free3d
              </li>
            </ul>
          </div>
          <div className={classes(styles.col, styles.thumbnails)}>
            <div>
              <img className={styles.thumbnail} src='/anemone.jpg' alt='' />
              <img className={styles.thumbnail} src='/crocus.jpg' alt='' />
              <img className={styles.thumbnail} src='/daffodil.jpg' alt='' />
            </div>
            <div>
              <img className={styles.thumbnail} src='/snowdrop.jpg' alt='' />
              <img className={styles.thumbnail} src='/tulip.jpg' alt='' />
              <img className={styles.thumbnail} src='/rabbit.jpg' alt='' />
              <img className={styles.thumbnail} src='/grass.jpg' alt='' />
            </div>
          </div>
        </div>
      </div>
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
