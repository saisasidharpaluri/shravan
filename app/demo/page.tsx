import Link from 'next/link';

export default function DemoPage() {
  return <main id="top" className="content-page demo-player-page">
    <div className="page-kicker"><span className="eyebrow-dot"/> EXTENDED PROJECT WALKTHROUGH</div>
    <div className="page-title-row">
      <div>
        <h1>See SHRAVAN in action</h1>
        <p>A three-minute walkthrough of the Telugu-English voice-report flow.</p>
      </div>
      <Link className="button button-secondary" href="/">← Back to SHRAVAN</Link>
    </div>

    <figure className="demo-player-card">
      <video
        className="demo-player"
        controls
        playsInline
        preload="metadata"
        aria-describedby="demo-video-note"
      >
        <source src="/demo/shravan-3-minute-demo.mp4" type="video/mp4" />
        <track
          kind="captions"
          src="/demo/shravan-3-minute-demo.en.vtt"
          srcLang="en"
          label="English and Telugu captions"
          default
        />
        Your browser does not support embedded video. <a href="/demo/shravan-3-minute-demo.mp4">Open the video file</a>.
      </video>
      <figcaption id="demo-video-note" className="demo-video-note">
        The opening street scene is an original animated illustration. The Telugu-English voice sample is synthetic. SHRAVAN saves this demo report in the browser; it is not submitted to a civic authority.
      </figcaption>
    </figure>

    <div className="demo-video-actions">
      <Link className="button button-primary" href="/report/voice">Try the voice report <span aria-hidden="true">→</span></Link>
      <a className="button button-secondary" href="/shravan-pitch.pdf" target="_blank" rel="noopener noreferrer">Read the project pitch <span aria-hidden="true">↗</span></a>
    </div>
  </main>;
}
