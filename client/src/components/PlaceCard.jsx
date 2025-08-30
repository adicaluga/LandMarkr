import "./PlaceCard.css";

// Need to make filters
export default function PlaceCard({ place, saved, canSave, onToggleFav }) {
  const photoRef = place.photos?.[0]?.photo_reference;
  const imgSrc = photoRef
    ? `http://localhost:4000/api/photo?ref=${encodeURIComponent(photoRef)}&w=480`
    : null;

  const rating = place.rating ?? "—";
  const total = place.user_ratings_total ?? 0;
  const openNow = place.opening_hours?.open_now;

  return (
    <article className="pc-card">
      {/*Thumbnail*/}
      <div className="pc-thumb">
        {imgSrc ? (<img src={imgSrc} alt={place.name} loading="lazy" />) : (<div className="pc-placeholder">No photo</div>)}
      </div>

      {/*Body of card*/}
      <div className="pc-body">
        <h4 className="pc-title">{place.name}</h4>
        <div className="pc-meta">
          <span className="pc-rating">⭐ {rating}</span>
          <span className="pc-count">({total})</span>
          {typeof openNow === "boolean" && (
            <span className={`pc-open ${openNow ? "open" : "closed"}`}>
              {openNow ? "Open now" : "Closed"}
            </span>
          )}
        </div>
        {place.vicinity && <div className="pc-addr">{place.vicinity}</div>}

        {/*Actions at the bottom of the card*/}
        <div className="pc-actions">
          <a
            className="pc-link"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${encodeURIComponent(place.place_id)}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Maps
          </a>
          <button
            className="pc-save"
            enabled={!canSave}
            title={!canSave ? "Create a user first" : saved ? "Remove from favourites" : "Save to favourites"}
            onClick={() => onToggleFav?.(place)}
          >
            Add to favourites
          </button>
        </div>
      </div>
    </article>
  );
}
