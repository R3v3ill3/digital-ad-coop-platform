export function extractAddressComponents(place) {
  const components = {
    suburb: '',
    state: '',
    postcode: '',
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
    formatted: place.formatted_address
  };

  place.address_components.forEach(component => {
    const types = component.types;
    if (types.includes('locality')) {
      components.suburb = component.long_name;
    }
    if (types.includes('administrative_area_level_1')) {
      components.state = component.short_name;
    }
    if (types.includes('postal_code')) {
      components.postcode = component.long_name;
    }
  });

  return components;
}
