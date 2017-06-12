function autocomplete(input, latInput, lngInput) {
  // if there's no input, don't run the function.
  if (!input) return;

  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    console.log(place);
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
  // if someone hits enter on the address field, don't submit the form.
  input.on('keydown', (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
    }
  });
}

export default autocomplete;