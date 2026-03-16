// Données géographiques complètes du Sénégal
// Source: Direction de la Prévision et des Statistiques (DPS)

export interface Region {
  id: string
  name: string
  code: string
  chefLieu: string
  population?: number
}

export interface Department {
  id: string
  name: string
  regionId: string
  chefLieu: string
}

export interface Arrondissement {
  id: string
  name: string
  departmentId: string
}

export interface Commune {
  id: string
  name: string
  type: 'commune' | 'commune_arrondissement' | 'ville'
  departmentId?: string
  arrondissementId?: string
  population?: number
}

// ================================
// 14 RÉGIONS DU SÉNÉGAL
// ================================
export const regions: Region[] = [
  { id: 'reg-01', name: 'Dakar', code: 'DK', chefLieu: 'Dakar', population: 3701840 },
  { id: 'reg-02', name: 'Diourbel', code: 'DB', chefLieu: 'Diourbel', population: 1929524 },
  { id: 'reg-03', name: 'Fatick', code: 'FK', chefLieu: 'Fatick', population: 776520 },
  { id: 'reg-04', name: 'Kaffrine', code: 'KA', chefLieu: 'Kaffrine', population: 637545 },
  { id: 'reg-05', name: 'Kaolack', code: 'KL', chefLieu: 'Kaolack', population: 1039142 },
  { id: 'reg-06', name: 'Kédougou', code: 'KE', chefLieu: 'Kédougou', population: 175670 },
  { id: 'reg-07', name: 'Kolda', code: 'KD', chefLieu: 'Kolda', population: 724543 },
  { id: 'reg-08', name: 'Louga', code: 'LG', chefLieu: 'Louga', population: 960875 },
  { id: 'reg-09', name: 'Matam', code: 'MT', chefLieu: 'Matam', population: 640152 },
  { id: 'reg-10', name: 'Saint-Louis', code: 'SL', chefLieu: 'Saint-Louis', population: 1035593 },
  { id: 'reg-11', name: 'Sédhiou', code: 'SD', chefLieu: 'Sédhiou', population: 513188 },
  { id: 'reg-12', name: 'Tambacounda', code: 'TC', chefLieu: 'Tambacounda', population: 767098 },
  { id: 'reg-13', name: 'Thiès', code: 'TH', chefLieu: 'Thiès', population: 1974639 },
  { id: 'reg-14', name: 'Ziguinchor', code: 'ZG', chefLieu: 'Ziguinchor', population: 688798 },
]

// ================================
// 46 DÉPARTEMENTS DU SÉNÉGAL
// ================================
export const departments: Department[] = [
  // Dakar (4 départements)
  { id: 'dep-01', name: 'Dakar', regionId: 'reg-01', chefLieu: 'Dakar' },
  { id: 'dep-02', name: 'Guédiawaye', regionId: 'reg-01', chefLieu: 'Guédiawaye' },
  { id: 'dep-03', name: 'Keur Massar', regionId: 'reg-01', chefLieu: 'Keur Massar' },
  { id: 'dep-04', name: 'Pikine', regionId: 'reg-01', chefLieu: 'Pikine' },
  { id: 'dep-05', name: 'Rufisque', regionId: 'reg-01', chefLieu: 'Rufisque' },

  // Diourbel (3 départements)
  { id: 'dep-06', name: 'Bambey', regionId: 'reg-02', chefLieu: 'Bambey' },
  { id: 'dep-07', name: 'Diourbel', regionId: 'reg-02', chefLieu: 'Diourbel' },
  { id: 'dep-08', name: 'Mbacké', regionId: 'reg-02', chefLieu: 'Mbacké' },

  // Fatick (3 départements)
  { id: 'dep-09', name: 'Fatick', regionId: 'reg-03', chefLieu: 'Fatick' },
  { id: 'dep-10', name: 'Foundiougne', regionId: 'reg-03', chefLieu: 'Foundiougne' },
  { id: 'dep-11', name: 'Gossas', regionId: 'reg-03', chefLieu: 'Gossas' },

  // Kaffrine (3 départements)
  { id: 'dep-12', name: 'Birkelane', regionId: 'reg-04', chefLieu: 'Birkelane' },
  { id: 'dep-13', name: 'Kaffrine', regionId: 'reg-04', chefLieu: 'Kaffrine' },
  { id: 'dep-14', name: 'Koungheul', regionId: 'reg-04', chefLieu: 'Koungheul' },
  { id: 'dep-15', name: 'Malem Hodar', regionId: 'reg-04', chefLieu: 'Malem Hodar' },

  // Kaolack (3 départements)
  { id: 'dep-16', name: 'Guinguinéo', regionId: 'reg-05', chefLieu: 'Guinguinéo' },
  { id: 'dep-17', name: 'Kaolack', regionId: 'reg-05', chefLieu: 'Kaolack' },
  { id: 'dep-18', name: 'Nioro du Rip', regionId: 'reg-05', chefLieu: 'Nioro du Rip' },

  // Kédougou (3 départements)
  { id: 'dep-19', name: 'Kédougou', regionId: 'reg-06', chefLieu: 'Kédougou' },
  { id: 'dep-20', name: 'Salémata', regionId: 'reg-06', chefLieu: 'Salémata' },
  { id: 'dep-21', name: 'Saraya', regionId: 'reg-06', chefLieu: 'Saraya' },

  // Kolda (3 départements)
  { id: 'dep-22', name: 'Kolda', regionId: 'reg-07', chefLieu: 'Kolda' },
  { id: 'dep-23', name: 'Médina Yoro Foulah', regionId: 'reg-07', chefLieu: 'Médina Yoro Foulah' },
  { id: 'dep-24', name: 'Vélingara', regionId: 'reg-07', chefLieu: 'Vélingara' },

  // Louga (3 départements)
  { id: 'dep-25', name: 'Kébémer', regionId: 'reg-08', chefLieu: 'Kébémer' },
  { id: 'dep-26', name: 'Linguère', regionId: 'reg-08', chefLieu: 'Linguère' },
  { id: 'dep-27', name: 'Louga', regionId: 'reg-08', chefLieu: 'Louga' },

  // Matam (3 départements)
  { id: 'dep-28', name: 'Kanel', regionId: 'reg-09', chefLieu: 'Kanel' },
  { id: 'dep-29', name: 'Matam', regionId: 'reg-09', chefLieu: 'Matam' },
  { id: 'dep-30', name: 'Ranérou Ferlo', regionId: 'reg-09', chefLieu: 'Ranérou' },

  // Saint-Louis (3 départements)
  { id: 'dep-31', name: 'Dagana', regionId: 'reg-10', chefLieu: 'Dagana' },
  { id: 'dep-32', name: 'Podor', regionId: 'reg-10', chefLieu: 'Podor' },
  { id: 'dep-33', name: 'Saint-Louis', regionId: 'reg-10', chefLieu: 'Saint-Louis' },

  // Sédhiou (3 départements)
  { id: 'dep-34', name: 'Bounkiling', regionId: 'reg-11', chefLieu: 'Bounkiling' },
  { id: 'dep-35', name: 'Goudomp', regionId: 'reg-11', chefLieu: 'Goudomp' },
  { id: 'dep-36', name: 'Sédhiou', regionId: 'reg-11', chefLieu: 'Sédhiou' },

  // Tambacounda (4 départements)
  { id: 'dep-37', name: 'Bakel', regionId: 'reg-12', chefLieu: 'Bakel' },
  { id: 'dep-38', name: 'Goudiry', regionId: 'reg-12', chefLieu: 'Goudiry' },
  { id: 'dep-39', name: 'Koumpentoum', regionId: 'reg-12', chefLieu: 'Koumpentoum' },
  { id: 'dep-40', name: 'Tambacounda', regionId: 'reg-12', chefLieu: 'Tambacounda' },

  // Thiès (3 départements)
  { id: 'dep-41', name: 'Fissel', regionId: 'reg-13', chefLieu: 'Fissel' },
  { id: 'dep-42', name: 'Mbour', regionId: 'reg-13', chefLieu: 'Mbour' },
  { id: 'dep-43', name: 'Thiès', regionId: 'reg-13', chefLieu: 'Thiès' },
  { id: 'dep-44', name: 'Tivaouane', regionId: 'reg-13', chefLieu: 'Tivaouane' },

  // Ziguinchor (3 départements)
  { id: 'dep-45', name: 'Bignona', regionId: 'reg-14', chefLieu: 'Bignona' },
  { id: 'dep-46', name: 'Oussouye', regionId: 'reg-14', chefLieu: 'Oussouye' },
  { id: 'dep-47', name: 'Ziguinchor', regionId: 'reg-14', chefLieu: 'Ziguinchor' },
]

// ================================
// ARRONDISSEMENTS
// ================================
export const arrondissements: Arrondissement[] = [
  // Dakar
  { id: 'arr-01', name: 'Almadies', departmentId: 'dep-01' },
  { id: 'arr-02', name: 'Dakar Plateau', departmentId: 'dep-01' },
  { id: 'arr-03', name: 'Grand Dakar', departmentId: 'dep-01' },
  { id: 'arr-04', name: 'Parcelles Assainies', departmentId: 'dep-01' },
  { id: 'arr-05', name: 'Médina', departmentId: 'dep-01' },
  { id: 'arr-06', name: 'Fann Point E', departmentId: 'dep-01' },
  { id: 'arr-07', name: 'Gorée', departmentId: 'dep-01' },
  { id: 'arr-08', name: 'Ngor', departmentId: 'dep-01' },
  { id: 'arr-09', name: 'Ouakam', departmentId: 'dep-01' },
  { id: 'arr-10', name: 'Yoff', departmentId: 'dep-01' },
  { id: 'arr-11', name: 'Hann Bel Air', departmentId: 'dep-01' },
  { id: 'arr-12', name: 'Dieuppeul Derklé', departmentId: 'dep-01' },
  { id: 'arr-13', name: 'Biscuiterie', departmentId: 'dep-01' },
  { id: 'arr-14', name: 'Sicap Liberté', departmentId: 'dep-01' },
  { id: 'arr-15', name: 'Patte d\'Oie', departmentId: 'dep-01' },
  { id: 'arr-16', name: 'Cambérène', departmentId: 'dep-01' },
  { id: 'arr-17', name: 'Sicap Baobab', departmentId: 'dep-01' },

  // Pikine
  { id: 'arr-18', name: 'Dagoudane', departmentId: 'dep-04' },
  { id: 'arr-19', name: 'Thiaroye', departmentId: 'dep-04' },
  { id: 'arr-20', name: 'Ndiarème Limamoulaye', departmentId: 'dep-04' },
  { id: 'arr-21', name: 'Yeumbeul Nord', departmentId: 'dep-04' },
  { id: 'arr-22', name: 'Yeumbeul Sud', departmentId: 'dep-04' },
  { id: 'arr-23', name: 'Diamaguène Sicap Mbao', departmentId: 'dep-04' },
  { id: 'arr-24', name: 'Tivaouane Diacksao', departmentId: 'dep-04' },
  { id: 'arr-25', name: 'Keur Massar Est', departmentId: 'dep-03' },
  { id: 'arr-26', name: 'Keur Massar Ouest', departmentId: 'dep-03' },
  { id: 'arr-27', name: 'Malika', departmentId: 'dep-03' },
  { id: 'arr-28', name: 'Jaxaay', departmentId: 'dep-03' },

  // Guédiawaye
  { id: 'arr-29', name: 'Gouye Mouride', departmentId: 'dep-02' },
  { id: 'arr-30', name: 'Ndiarème', departmentId: 'dep-02' },
  { id: 'arr-31', name: 'Sam Notaire', departmentId: 'dep-02' },
  { id: 'arr-32', name: 'Wakhinane Nimzatt', departmentId: 'dep-02' },

  // Rufisque
  { id: 'arr-33', name: 'Rufisque Est', departmentId: 'dep-05' },
  { id: 'arr-34', name: 'Rufisque Ouest', departmentId: 'dep-05' },
  { id: 'arr-35', name: 'Bargny', departmentId: 'dep-05' },
  { id: 'arr-36', name: 'Diamniadio', departmentId: 'dep-05' },
  { id: 'arr-37', name: 'Sébikhotane', departmentId: 'dep-05' },
  { id: 'arr-38', name: 'Diender', departmentId: 'dep-05' },
  { id: 'arr-39', name: 'Jembour', departmentId: 'dep-05' },
  { id: 'arr-40', name: 'Tivaouane Peulh-Niaga', departmentId: 'dep-05' },
  { id: 'arr-41', name: 'Sendou', departmentId: 'dep-05' },
  { id: 'arr-42', name: 'Bambylor', departmentId: 'dep-05' },
  { id: 'arr-43', name: 'Yène', departmentId: 'dep-05' },

  // Thiès
  { id: 'arr-44', name: 'Thiès Nord', departmentId: 'dep-43' },
  { id: 'arr-45', name: 'Thiès Sud', departmentId: 'dep-43' },
  { id: 'arr-46', name: 'Thiès Est', departmentId: 'dep-43' },
  { id: 'arr-47', name: 'Ngaparou', departmentId: 'dep-43' },
  { id: 'arr-48', name: 'Notto Gouye Diama', departmentId: 'dep-43' },
  { id: 'arr-49', name: 'Thiénaba', departmentId: 'dep-43' },
  { id: 'arr-50', name: 'Keur Moussa', departmentId: 'dep-43' },
  { id: 'arr-51', name: 'Fandène', departmentId: 'dep-43' },
  { id: 'arr-52', name: 'Diass', departmentId: 'dep-43' },
  { id: 'arr-53', name: 'Sandiara', departmentId: 'dep-43' },

  // Mbour
  { id: 'arr-54', name: 'Mbour', departmentId: 'dep-42' },
  { id: 'arr-55', name: 'Saly', departmentId: 'dep-42' },
  { id: 'arr-56', name: 'Somone', departmentId: 'dep-42' },
  { id: 'arr-57', name: 'Ngaparou', departmentId: 'dep-42' },
  { id: 'arr-58', name: 'Nianing', departmentId: 'dep-42' },
  { id: 'arr-59', name: 'Warang', departmentId: 'dep-42' },
  { id: 'arr-60', name: 'Mballing', departmentId: 'dep-42' },
  { id: 'arr-61', name: 'Malicounda', departmentId: 'dep-42' },
  { id: 'arr-62', name: 'Nguékhokh', departmentId: 'dep-42' },
  { id: 'arr-63', name: 'Fissel', departmentId: 'dep-41' },

  // Tivaouane
  { id: 'arr-64', name: 'Tivaouane', departmentId: 'dep-44' },
  { id: 'arr-65', name: 'Méouane', departmentId: 'dep-44' },
  { id: 'arr-66', name: 'Koul', departmentId: 'dep-44' },
  { id: 'arr-67', name: 'Mérina', departmentId: 'dep-44' },
  { id: 'arr-68', name: 'Pambal', departmentId: 'dep-44' },
  { id: 'arr-69', name: 'Darou Khoudoss', departmentId: 'dep-44' },
  { id: 'arr-70', name: 'Ndiobène', departmentId: 'dep-44' },
  { id: 'arr-71', name: 'Mont Rolland', departmentId: 'dep-44' },
  { id: 'arr-72', name: 'Khombole', departmentId: 'dep-44' },
  { id: 'arr-73', name: 'Pout', departmentId: 'dep-44' },
  { id: 'arr-74', name: 'Sandiara', departmentId: 'dep-44' },

  // Diourbel
  { id: 'arr-75', name: 'Diourbel', departmentId: 'dep-07' },
  { id: 'arr-76', name: 'Ndindy', departmentId: 'dep-07' },
  { id: 'arr-77', name: 'Ndoulo', departmentId: 'dep-07' },

  // Mbacké
  { id: 'arr-78', name: 'Mbacké', departmentId: 'dep-08' },
  { id: 'arr-79', name: 'Kael', departmentId: 'dep-08' },
  { id: 'arr-80', name: 'Missirah', departmentId: 'dep-08' },
  { id: 'arr-81', name: 'Touba', departmentId: 'dep-08' },
  { id: 'arr-82', name: 'Dalla', departmentId: 'dep-08' },
  { id: 'arr-83', name: 'Dahra', departmentId: 'dep-08' },
  { id: 'arr-84', name: 'Déali', departmentId: 'dep-08' },
  { id: 'arr-85', name: 'Ndame', departmentId: 'dep-08' },
  { id: 'arr-86', name: 'Taïf', departmentId: 'dep-08' },

  // Bambey
  { id: 'arr-87', name: 'Bambey', departmentId: 'dep-06' },
  { id: 'arr-88', name: 'Baba Garage', departmentId: 'dep-06' },
  { id: 'arr-89', name: 'Lambaye', departmentId: 'dep-06' },
  { id: 'arr-90', name: 'Ngogom', departmentId: 'dep-06' },

  // Saint-Louis
  { id: 'arr-91', name: 'Saint-Louis', departmentId: 'dep-33' },
  { id: 'arr-92', name: 'Rao', departmentId: 'dep-33' },
  { id: 'arr-93', name: 'Ndiago', departmentId: 'dep-33' },

  // Dagana
  { id: 'arr-94', name: 'Dagana', departmentId: 'dep-31' },
  { id: 'arr-95', name: 'Mbane', departmentId: 'dep-31' },
  { id: 'arr-96', name: 'Ndioum', departmentId: 'dep-31' },
  { id: 'arr-97', name: 'Richard Toll', departmentId: 'dep-31' },
  { id: 'arr-98', name: 'Ross Béthio', departmentId: 'dep-31' },
  { id: 'arr-99', name: 'Bokhol', departmentId: 'dep-31' },

  // Podor
  { id: 'arr-100', name: 'Podor', departmentId: 'dep-32' },
  { id: 'arr-101', name: 'Gamadji Saré', departmentId: 'dep-32' },
  { id: 'arr-102', name: 'Mboumba', departmentId: 'dep-32' },
  { id: 'arr-103', name: 'Saldé', departmentId: 'dep-32' },
  { id: 'arr-104', name: 'Galoya Toucouleur', departmentId: 'dep-32' },
  { id: 'arr-105', name: 'Dodel', departmentId: 'dep-32' },
  { id: 'arr-106', name: 'Ndioum', departmentId: 'dep-32' },
  { id: 'arr-107', name: 'Walaldé', departmentId: 'dep-32' },

  // Louga
  { id: 'arr-108', name: 'Louga', departmentId: 'dep-27' },
  { id: 'arr-109', name: 'Coki', departmentId: 'dep-27' },
  { id: 'arr-110', name: 'Ndokh', departmentId: 'dep-27' },
  { id: 'arr-111', name: 'Mpal', departmentId: 'dep-27' },
  { id: 'arr-112', name: 'Kébémer', departmentId: 'dep-25' },
  { id: 'arr-113', name: 'Darou Mousty', departmentId: 'dep-25' },
  { id: 'arr-114', name: 'Khombole', departmentId: 'dep-25' },
  { id: 'arr-115', name: 'Léona', departmentId: 'dep-25' },
  { id: 'arr-116', name: 'Mboss', departmentId: 'dep-25' },
  { id: 'arr-117', name: 'Sagatta', departmentId: 'dep-25' },
  { id: 'arr-118', name: 'Dahra', departmentId: 'dep-26' },
  { id: 'arr-119', name: 'Dodji', departmentId: 'dep-26' },
  { id: 'arr-120', name: 'Labgar', departmentId: 'dep-26' },
  { id: 'arr-121', name: 'Yang-Yang', departmentId: 'dep-26' },
  { id: 'arr-122', name: 'Barkédji', departmentId: 'dep-26' },
  { id: 'arr-123', name: 'Dodji', departmentId: 'dep-26' },
  { id: 'arr-124', name: 'Sagatta Diithiory', departmentId: 'dep-26' },

  // Matam
  { id: 'arr-125', name: 'Matam', departmentId: 'dep-29' },
  { id: 'arr-126', name: 'Agnam', departmentId: 'dep-29' },
  { id: 'arr-127', name: 'Ogo', departmentId: 'dep-29' },
  { id: 'arr-128', name: 'Nguidjilone', departmentId: 'dep-28' },
  { id: 'arr-129', name: 'Orkadiéré', departmentId: 'dep-28' },
  { id: 'arr-130', name: 'Wouro Sidy', departmentId: 'dep-28' },
  { id: 'arr-131', name: 'Sémé', departmentId: 'dep-28' },
  { id: 'arr-132', name: 'Bokidiawé', departmentId: 'dep-28' },
  { id: 'arr-133', name: 'Vélingara', departmentId: 'dep-30' },
  { id: 'arr-134', name: 'Oundam', departmentId: 'dep-30' },
  { id: 'arr-135', name: 'Yaré Lao', departmentId: 'dep-30' },

  // Kaolack
  { id: 'arr-136', name: 'Kaolack', departmentId: 'dep-17' },
  { id: 'arr-137', name: 'Koumbal', departmentId: 'dep-17' },
  { id: 'arr-138', name: 'Ndiedieng', departmentId: 'dep-17' },
  { id: 'arr-139', name: 'Guinguinéo', departmentId: 'dep-16' },
  { id: 'arr-140', name: 'Mbadakhoune', departmentId: 'dep-16' },
  { id: 'arr-141', name: 'Fissel', departmentId: 'dep-16' },
  { id: 'arr-142', name: 'Nioro du Rip', departmentId: 'dep-18' },
  { id: 'arr-143', name: 'Wack Ngouna', departmentId: 'dep-18' },
  { id: 'arr-144', name: 'Keur Maba Diakhou', departmentId: 'dep-18' },
  { id: 'arr-145', name: 'Pakala', departmentId: 'dep-18' },
  { id: 'arr-146', name: 'Medina Sabakh', departmentId: 'dep-18' },

  // Fatick
  { id: 'arr-147', name: 'Fatick', departmentId: 'dep-09' },
  { id: 'arr-148', name: 'Fimela', departmentId: 'dep-09' },
  { id: 'arr-149', name: 'Niakhar', departmentId: 'dep-09' },
  { id: 'arr-150', name: 'Tattaguine', departmentId: 'dep-09' },
  { id: 'arr-151', name: 'Diofior', departmentId: 'dep-10' },
  { id: 'arr-152', name: 'Foundiougne', departmentId: 'dep-10' },
  { id: 'arr-153', name: 'Niodior', departmentId: 'dep-10' },
  { id: 'arr-154', name: 'Djilor', departmentId: 'dep-10' },
  { id: 'arr-155', name: 'Sokone', departmentId: 'dep-10' },
  { id: 'arr-156', name: 'Toubacouta', departmentId: 'dep-10' },
  { id: 'arr-157', name: 'Gossas', departmentId: 'dep-11' },
  { id: 'arr-158', name: 'Colobane', departmentId: 'dep-11' },
  { id: 'arr-159', name: 'Ouadiour', departmentId: 'dep-11' },

  // Kaffrine
  { id: 'arr-160', name: 'Kaffrine', departmentId: 'dep-13' },
  { id: 'arr-161', name: 'Gniby', departmentId: 'dep-13' },
  { id: 'arr-162', name: 'Katakel', departmentId: 'dep-13' },
  { id: 'arr-163', name: 'Koungheul', departmentId: 'dep-14' },
  { id: 'arr-164', name: 'Missirah', departmentId: 'dep-14' },
  { id: 'arr-165', name: 'Meme', departmentId: 'dep-14' },
  { id: 'arr-166', name: 'Ida Mouride', departmentId: 'dep-14' },
  { id: 'arr-167', name: 'Lour Escale', departmentId: 'dep-14' },
  { id: 'arr-168', name: 'Birkelane', departmentId: 'dep-12' },
  { id: 'arr-169', name: 'Dakateli', departmentId: 'dep-12' },
  { id: 'arr-170', name: 'Khouribgui', departmentId: 'dep-12' },
  { id: 'arr-171', name: 'Malem Hodar', departmentId: 'dep-15' },

  // Tambacounda
  { id: 'arr-172', name: 'Tambacounda', departmentId: 'dep-40' },
  { id: 'arr-173', name: 'Koumpentoum', departmentId: 'dep-40' },
  { id: 'arr-174', name: 'Makacolibantang', departmentId: 'dep-40' },
  { id: 'arr-175', name: 'Missirah', departmentId: 'dep-40' },
  { id: 'arr-176', name: 'Bakel', departmentId: 'dep-37' },
  { id: 'arr-177', name: 'Bélé', departmentId: 'dep-37' },
  { id: 'arr-178', name: 'Diana Malari', departmentId: 'dep-37' },
  { id: 'arr-179', name: 'Diawara', departmentId: 'dep-37' },
  { id: 'arr-180', name: 'Kidira', departmentId: 'dep-37' },
  { id: 'arr-181', name: 'Goudiry', departmentId: 'dep-38' },
  { id: 'arr-182', name: 'Diantiandro', departmentId: 'dep-38' },
  { id: 'arr-183', name: 'Kothiary', departmentId: 'dep-38' },
  { id: 'arr-184', name: 'Bala', departmentId: 'dep-38' },
  { id: 'arr-185', name: 'Boutoucoufara', departmentId: 'dep-38' },
  { id: 'arr-186', name: 'Koumpentoum', departmentId: 'dep-39' },
  { id: 'arr-187', name: 'Bamba Thialène', departmentId: 'dep-39' },
  { id: 'arr-188', name: 'Coubal', departmentId: 'dep-39' },
  { id: 'arr-189', name: 'Kouthiaba Wolof', departmentId: 'dep-39' },

  // Kolda
  { id: 'arr-190', name: 'Kolda', departmentId: 'dep-22' },
  { id: 'arr-191', name: 'Dabola', departmentId: 'dep-22' },
  { id: 'arr-192', name: 'Dianhéli Makana', departmentId: 'dep-22' },
  { id: 'arr-193', name: 'Dabo', departmentId: 'dep-22' },
  { id: 'arr-194', name: 'Saré Yoba Diégui', departmentId: 'dep-22' },
  { id: 'arr-195', name: 'Médina Yoro Foulah', departmentId: 'dep-23' },
  { id: 'arr-196', name: 'Fafacourou', departmentId: 'dep-23' },
  { id: 'arr-197', name: 'Ndorna', departmentId: 'dep-23' },
  { id: 'arr-198', name: 'Niaming', departmentId: 'dep-23' },
  { id: 'arr-199', name: 'Yoro', departmentId: 'dep-23' },
  { id: 'arr-200', name: 'Fafayiri', departmentId: 'dep-23' },
  { id: 'arr-201', name: 'Vélingara', departmentId: 'dep-24' },
  { id: 'arr-202', name: 'Bonconto', departmentId: 'dep-24' },
  { id: 'arr-203', name: 'Diaobé-Kabendou', departmentId: 'dep-24' },
  { id: 'arr-204', name: 'Pakour', departmentId: 'dep-24' },
  { id: 'arr-205', name: 'Saré Bidji', departmentId: 'dep-24' },
  { id: 'arr-206', name: 'Wouro Sidi', departmentId: 'dep-24' },
  { id: 'arr-207', name: 'Kounkané', departmentId: 'dep-24' },

  // Sédhiou
  { id: 'arr-208', name: 'Sédhiou', departmentId: 'dep-36' },
  { id: 'arr-209', name: 'Bourofané', departmentId: 'dep-36' },
  { id: 'arr-210', name: 'Djibabou', departmentId: 'dep-36' },
  { id: 'arr-211', name: 'Djiredji', departmentId: 'dep-36' },
  { id: 'arr-212', name: 'Bounkiling', departmentId: 'dep-34' },
  { id: 'arr-213', name: 'Boghal', departmentId: 'dep-34' },
  { id: 'arr-214', name: 'Bona', departmentId: 'dep-34' },
  { id: 'arr-215', name: 'Diaroumé', departmentId: 'dep-34' },
  { id: 'arr-216', name: 'Inor', departmentId: 'dep-34' },
  { id: 'arr-217', name: 'Samina', departmentId: 'dep-34' },
  { id: 'arr-218', name: 'Goudomp', departmentId: 'dep-35' },
  { id: 'arr-219', name: 'Boundoucondi', departmentId: 'dep-35' },
  { id: 'arr-220', name: 'Djibidione', departmentId: 'dep-35' },
  { id: 'arr-221', name: 'Simbandi Brassou', departmentId: 'dep-35' },
  { id: 'arr-222', name: 'Niaguis', departmentId: 'dep-35' },
  { id: 'arr-223', name: 'Samine', departmentId: 'dep-35' },
  { id: 'arr-224', name: 'Adéane', departmentId: 'dep-35' },

  // Ziguinchor
  { id: 'arr-225', name: 'Ziguinchor', departmentId: 'dep-47' },
  { id: 'arr-226', name: 'Niaguis', departmentId: 'dep-47' },
  { id: 'arr-227', name: 'Nyassia', departmentId: 'dep-47' },
  { id: 'arr-228', name: 'Adeane', departmentId: 'dep-47' },
  { id: 'arr-229', name: 'Enampore', departmentId: 'dep-47' },
  { id: 'arr-230', name: 'Bignona', departmentId: 'dep-45' },
  { id: 'arr-231', name: 'Diouloulou', departmentId: 'dep-45' },
  { id: 'arr-232', name: 'Kataba 1', departmentId: 'dep-45' },
  { id: 'arr-233', name: 'Kataba 2', departmentId: 'dep-45' },
  { id: 'arr-234', name: 'Sindian', departmentId: 'dep-45' },
  { id: 'arr-235', name: 'Tendouck', departmentId: 'dep-45' },
  { id: 'arr-236', name: 'Tenghory', departmentId: 'dep-45' },
  { id: 'arr-237', name: 'Oussouye', departmentId: 'dep-46' },
  { id: 'arr-238', name: 'Kabrousse', departmentId: 'dep-46' },
  { id: 'arr-239', name: 'Loudia Wolof', departmentId: 'dep-46' },
  { id: 'arr-240', name: 'Santhiaba Manjack', departmentId: 'dep-46' },

  // Kédougou
  { id: 'arr-241', name: 'Kédougou', departmentId: 'dep-19' },
  { id: 'arr-242', name: 'Fongolimbi', departmentId: 'dep-19' },
  { id: 'arr-243', name: 'Khossanto', departmentId: 'dep-19' },
  { id: 'arr-244', name: 'Tomory', departmentId: 'dep-19' },
  { id: 'arr-245', name: 'Bandafassi', departmentId: 'dep-19' },
  { id: 'arr-246', name: 'Dakateli', departmentId: 'dep-19' },
  { id: 'arr-247', name: 'Dindefelo', departmentId: 'dep-19' },
  { id: 'arr-248', name: 'Salémata', departmentId: 'dep-20' },
  { id: 'arr-249', name: 'Dakateli', departmentId: 'dep-20' },
  { id: 'arr-250', name: 'Ethiolou', departmentId: 'dep-20' },
  { id: 'arr-251', name: 'Fassankouré', departmentId: 'dep-20' },
  { id: 'arr-252', name: 'Kénioto', departmentId: 'dep-20' },
  { id: 'arr-253', name: 'Saraya', departmentId: 'dep-21' },
  { id: 'arr-254', name: 'Bala', departmentId: 'dep-21' },
  { id: 'arr-255', name: 'Bembou', departmentId: 'dep-21' },
  { id: 'arr-256', name: 'Khossanto', departmentId: 'dep-21' },
  { id: 'arr-257', name: 'Sabadala', departmentId: 'dep-21' },
  { id: 'arr-258', name: 'Missirah', departmentId: 'dep-21' },
  { id: 'arr-259', name: 'Kédougou', departmentId: 'dep-21' },
]

// ================================
// COMMUNES / VILLES PRINCIPALES
// ================================
export const communes: Commune[] = [
  // Région de Dakar
  { id: 'com-01', name: 'Dakar', type: 'ville', departmentId: 'dep-01', population: 1146053 },
  { id: 'com-02', name: 'Pikine', type: 'ville', departmentId: 'dep-04', population: 1170791 },
  { id: 'com-03', name: 'Guédiawaye', type: 'ville', departmentId: 'dep-02', population: 329659 },
  { id: 'com-04', name: 'Rufisque', type: 'ville', departmentId: 'dep-05', population: 372085 },
  { id: 'com-05', name: 'Keur Massar', type: 'ville', departmentId: 'dep-03', population: 472352 },
  { id: 'com-06', name: 'Bargny', type: 'commune', departmentId: 'dep-05', population: 68913 },
  { id: 'com-07', name: 'Diamniadio', type: 'commune', departmentId: 'dep-05', population: 25000 },
  { id: 'com-08', name: 'Sébikhotane', type: 'commune', departmentId: 'dep-05', population: 35000 },
  { id: 'com-09', name: 'Malika', type: 'commune', departmentId: 'dep-03', population: 71000 },
  { id: 'com-10', name: 'Jaxaay', type: 'commune', departmentId: 'dep-03', population: 45000 },
  { id: 'com-11', name: 'Bambylor', type: 'commune', departmentId: 'dep-05', population: 28000 },
  { id: 'com-12', name: 'Sendou', type: 'commune', departmentId: 'dep-05', population: 15000 },
  { id: 'com-13', name: 'Yène', type: 'commune', departmentId: 'dep-05', population: 22000 },

  // Région de Thiès
  { id: 'com-14', name: 'Thiès', type: 'ville', departmentId: 'dep-43', population: 320354 },
  { id: 'com-15', name: 'Mbour', type: 'ville', departmentId: 'dep-42', population: 275818 },
  { id: 'com-16', name: 'Tivaouane', type: 'ville', departmentId: 'dep-44', population: 207992 },
  { id: 'com-17', name: 'Saly', type: 'commune', departmentId: 'dep-42', population: 35000 },
  { id: 'com-18', name: 'Somone', type: 'commune', departmentId: 'dep-42', population: 12000 },
  { id: 'com-19', name: 'Ngaparou', type: 'commune', departmentId: 'dep-42', population: 18000 },
  { id: 'com-20', name: 'Nianing', type: 'commune', departmentId: 'dep-42', population: 25000 },
  { id: 'com-21', name: 'Pout', type: 'commune', departmentId: 'dep-44', population: 45000 },
  { id: 'com-22', name: 'Khombole', type: 'commune', departmentId: 'dep-44', population: 38000 },
  { id: 'com-23', name: 'Méouane', type: 'commune', departmentId: 'dep-44', population: 22000 },
  { id: 'com-24', name: 'Darou Khoudoss', type: 'commune', departmentId: 'dep-44', population: 18000 },
  { id: 'com-25', name: 'Sandiara', type: 'commune', departmentId: 'dep-43', population: 15000 },
  { id: 'com-26', name: 'Fandène', type: 'commune', departmentId: 'dep-43', population: 12000 },
  { id: 'com-27', name: 'Ngao', type: 'commune', departmentId: 'dep-42', population: 8000 },
  { id: 'com-28', name: 'Malicounda', type: 'commune', departmentId: 'dep-42', population: 16000 },
  { id: 'com-29', name: 'Nguékhokh', type: 'commune', departmentId: 'dep-42', population: 14000 },
  { id: 'com-30', name: 'Fissel', type: 'commune', departmentId: 'dep-41', population: 20000 },
  { id: 'com-31', name: 'Keur Moussa', type: 'commune', departmentId: 'dep-43', population: 10000 },
  { id: 'com-32', name: 'Notto Gouye Diama', type: 'commune', departmentId: 'dep-43', population: 8000 },
  { id: 'com-33', name: 'Diass', type: 'commune', departmentId: 'dep-43', population: 12000 },

  // Région de Diourbel
  { id: 'com-34', name: 'Diourbel', type: 'ville', departmentId: 'dep-07', population: 132755 },
  { id: 'com-35', name: 'Touba', type: 'ville', departmentId: 'dep-08', population: 753315 },
  { id: 'com-36', name: 'Mbacké', type: 'ville', departmentId: 'dep-08', population: 250000 },
  { id: 'com-37', name: 'Bambey', type: 'commune', departmentId: 'dep-06', population: 82000 },
  { id: 'com-38', name: 'Darou Mousty', type: 'commune', departmentId: 'dep-06', population: 45000 },

  // Région de Saint-Louis
  { id: 'com-39', name: 'Saint-Louis', type: 'ville', departmentId: 'dep-33', population: 232836 },
  { id: 'com-40', name: 'Richard Toll', type: 'commune', departmentId: 'dep-31', population: 89572 },
  { id: 'com-41', name: 'Dagana', type: 'commune', departmentId: 'dep-31', population: 48205 },
  { id: 'com-42', name: 'Podor', type: 'commune', departmentId: 'dep-32', population: 37213 },
  { id: 'com-43', name: 'Ndioum', type: 'commune', departmentId: 'dep-31', population: 28000 },
  { id: 'com-44', name: 'Ross Béthio', type: 'commune', departmentId: 'dep-31', population: 25000 },
  { id: 'com-45', name: 'Bokhol', type: 'commune', departmentId: 'dep-31', population: 18000 },
  { id: 'com-46', name: 'Gamadji Saré', type: 'commune', departmentId: 'dep-32', population: 12000 },
  { id: 'com-47', name: 'Dodel', type: 'commune', departmentId: 'dep-32', population: 8000 },

  // Région de Louga
  { id: 'com-48', name: 'Louga', type: 'ville', departmentId: 'dep-27', population: 119967 },
  { id: 'com-49', name: 'Kébémer', type: 'commune', departmentId: 'dep-25', population: 71865 },
  { id: 'com-50', name: 'Linguère', type: 'commune', departmentId: 'dep-26', population: 32000 },
  { id: 'com-51', name: 'Dahra', type: 'commune', departmentId: 'dep-26', population: 28000 },
  { id: 'com-52', name: 'Coki', type: 'commune', departmentId: 'dep-27', population: 18000 },
  { id: 'com-53', name: 'Mpal', type: 'commune', departmentId: 'dep-27', population: 15000 },

  // Région de Matam
  { id: 'com-54', name: 'Matam', type: 'ville', departmentId: 'dep-29', population: 25562 },
  { id: 'com-55', name: 'Kanel', type: 'commune', departmentId: 'dep-28', population: 18000 },
  { id: 'com-56', name: 'Ranérou', type: 'commune', departmentId: 'dep-30', population: 12000 },
  { id: 'com-57', name: 'Ogo', type: 'commune', departmentId: 'dep-29', population: 8000 },
  { id: 'com-58', name: 'Nguidjilone', type: 'commune', departmentId: 'dep-28', population: 6000 },
  { id: 'com-59', name: 'Waoundé', type: 'commune', departmentId: 'dep-29', population: 7000 },

  // Région de Kaolack
  { id: 'com-60', name: 'Kaolack', type: 'ville', departmentId: 'dep-17', population: 241287 },
  { id: 'com-61', name: 'Guinguinéo', type: 'commune', departmentId: 'dep-16', population: 32000 },
  { id: 'com-62', name: 'Nioro du Rip', type: 'commune', departmentId: 'dep-18', population: 28000 },
  { id: 'com-63', name: 'Kahone', type: 'commune', departmentId: 'dep-17', population: 15000 },
  { id: 'com-64', name: 'Ndiedieng', type: 'commune', departmentId: 'dep-17', population: 12000 },
  { id: 'com-65', name: 'Koumbal', type: 'commune', departmentId: 'dep-17', population: 10000 },
  { id: 'com-66', name: 'Wack Ngouna', type: 'commune', departmentId: 'dep-18', population: 8000 },

  // Région de Fatick
  { id: 'com-67', name: 'Fatick', type: 'ville', departmentId: 'dep-09', population: 28629 },
  { id: 'com-68', name: 'Foundiougne', type: 'commune', departmentId: 'dep-10', population: 22000 },
  { id: 'com-69', name: 'Gossas', type: 'commune', departmentId: 'dep-11', population: 18000 },
  { id: 'com-70', name: 'Diofior', type: 'commune', departmentId: 'dep-10', population: 15000 },
  { id: 'com-71', name: 'Sokone', type: 'commune', departmentId: 'dep-10', population: 18000 },
  { id: 'com-72', name: 'Passy', type: 'commune', departmentId: 'dep-10', population: 12000 },
  { id: 'com-73', name: 'Niakhar', type: 'commune', departmentId: 'dep-09', population: 10000 },
  { id: 'com-74', name: 'Tattaguine', type: 'commune', departmentId: 'dep-09', population: 8000 },

  // Région de Kaffrine
  { id: 'com-75', name: 'Kaffrine', type: 'ville', departmentId: 'dep-13', population: 45000 },
  { id: 'com-76', name: 'Koungheul', type: 'commune', departmentId: 'dep-14', population: 32000 },
  { id: 'com-77', name: 'Birkelane', type: 'commune', departmentId: 'dep-12', population: 18000 },
  { id: 'com-78', name: 'Malem Hodar', type: 'commune', departmentId: 'dep-15', population: 12000 },
  { id: 'com-79', name: 'Nganda', type: 'commune', departmentId: 'dep-14', population: 10000 },
  { id: 'com-80', name: 'Gniby', type: 'commune', departmentId: 'dep-13', population: 8000 },

  // Région de Tambacounda
  { id: 'com-81', name: 'Tambacounda', type: 'ville', departmentId: 'dep-40', population: 107293 },
  { id: 'com-82', name: 'Bakel', type: 'commune', departmentId: 'dep-37', population: 22000 },
  { id: 'com-83', name: 'Koumpentoum', type: 'commune', departmentId: 'dep-39', population: 18000 },
  { id: 'com-84', name: 'Goudiry', type: 'commune', departmentId: 'dep-38', population: 15000 },
  { id: 'com-85', name: 'Kidira', type: 'commune', departmentId: 'dep-37', population: 12000 },
  { id: 'com-86', name: 'Diawara', type: 'commune', departmentId: 'dep-37', population: 10000 },

  // Région de Kolda
  { id: 'com-87', name: 'Kolda', type: 'ville', departmentId: 'dep-22', population: 62158 },
  { id: 'com-88', name: 'Vélingara', type: 'commune', departmentId: 'dep-24', population: 38000 },
  { id: 'com-89', name: 'Médina Yoro Foulah', type: 'commune', departmentId: 'dep-23', population: 15000 },
  { id: 'com-90', name: 'Saré Yoba Diégui', type: 'commune', departmentId: 'dep-22', population: 10000 },
  { id: 'com-91', name: 'Diaobé-Kabendou', type: 'commune', departmentId: 'dep-24', population: 18000 },

  // Région de Sédhiou
  { id: 'com-92', name: 'Sédhiou', type: 'ville', departmentId: 'dep-36', population: 27787 },
  { id: 'com-93', name: 'Bounkiling', type: 'commune', departmentId: 'dep-34', population: 18000 },
  { id: 'com-94', name: 'Goudomp', type: 'commune', departmentId: 'dep-35', population: 15000 },
  { id: 'com-95', name: 'Marsassoum', type: 'commune', departmentId: 'dep-35', population: 10000 },
  { id: 'com-96', name: 'Djibidione', type: 'commune', departmentId: 'dep-35', population: 8000 },

  // Région de Ziguinchor
  { id: 'com-97', name: 'Ziguinchor', type: 'ville', departmentId: 'dep-47', population: 230653 },
  { id: 'com-98', name: 'Bignona', type: 'commune', departmentId: 'dep-45', population: 35000 },
  { id: 'com-99', name: 'Oussouye', type: 'commune', departmentId: 'dep-46', population: 12000 },
  { id: 'com-100', name: 'Diouloulou', type: 'commune', departmentId: 'dep-45', population: 15000 },
  { id: 'com-101', name: 'Thionck Essyl', type: 'commune', departmentId: 'dep-45', population: 12000 },
  { id: 'com-102', name: 'Tendouck', type: 'commune', departmentId: 'dep-45', population: 10000 },

  // Région de Kédougou
  { id: 'com-103', name: 'Kédougou', type: 'ville', departmentId: 'dep-19', population: 23178 },
  { id: 'com-104', name: 'Salémata', type: 'commune', departmentId: 'dep-20', population: 8000 },
  { id: 'com-105', name: 'Saraya', type: 'commune', departmentId: 'dep-21', population: 6000 },
  { id: 'com-106', name: 'Bandafassi', type: 'commune', departmentId: 'dep-19', population: 5000 },
  { id: 'com-107', name: 'Dindefelo', type: 'commune', departmentId: 'dep-19', population: 4000 },
]

// ================================
// VILLES PRINCIPALES POUR AFFICHAGE
// ================================
export const popularCities = [
  'Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès', 'Mbour',
  'Touba', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Tivaouane',
  'Diourbel', 'Louga', 'Kolda', 'Tambacounda', 'Richard Toll'
]

// Fonction pour obtenir toutes les localités
export function getAllLocalities() {
  const localities: { name: string; type: string; region: string; department: string }[] = []
  
  // Ajouter toutes les communes
  communes.forEach(com => {
    const dept = departments.find(d => d.id === com.departmentId)
    const reg = dept ? regions.find(r => r.id === dept.regionId) : null
    localities.push({
      name: com.name,
      type: com.type,
      region: reg?.name || '',
      department: dept?.name || ''
    })
  })
  
  return localities.sort((a, b) => a.name.localeCompare(b.name))
}

// Fonction pour obtenir les villes par région
export function getCitiesByRegion(regionName: string) {
  const region = regions.find(r => r.name === regionName)
  if (!region) return []
  
  const regionDepts = departments.filter(d => d.regionId === region.id)
  const deptIds = regionDepts.map(d => d.id)
  
  return communes.filter(c => c.departmentId && deptIds.includes(c.departmentId))
}

// Fonction pour obtenir les villes par département
export function getCitiesByDepartment(deptName: string) {
  const dept = departments.find(d => d.name === deptName)
  if (!dept) return []
  
  return communes.filter(c => c.departmentId === dept.id)
}

// Export pour Firebase
export const geoDataForFirebase = {
  regions,
  departments,
  arrondissements,
  communes
}
