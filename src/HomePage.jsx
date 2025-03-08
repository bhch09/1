import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCmqS52ypihassF4hYlFnfNr5VMxxlYsis",
  authDomain: "project-6a7c4.firebaseapp.com",
  databaseURL: "https://project-6a7c4-default-rtdb.firebaseio.com",
  projectId: "project-6a7c4",
  storageBucket: "project-6a7c4.appspot.com",
  messagingSenderId: "152367969169",
  appId: "1:152367969169:web:6bc05a9d8152391e07e030"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const HomePage = ({ onStartChat }) => {
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('chatUser') || null);
  const [messages, setMessages] = useState([]);
  const [lastReadMessage, setLastReadMessage] = useState(parseInt(localStorage.getItem('lastReadMessage') || '0', 10));

  // Create audio object outside component to ensure it's ready
  const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3');

  // Play notification sound when a new message is received
  useEffect(() => {
    if (hasNewMessage) {
      notificationSound.play().catch(e => console.log("Audio play error:", e));
    }
  }, [hasNewMessage]);

  // Listen for messages
  useEffect(() => {
    const messagesRef = ref(database, 'messages');

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = [];
      let hasUnread = false;
      let latestMessageTimestamp = 0;

      snapshot.forEach((childSnapshot) => {
        const message = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };
        messagesData.push(message);

        // Keep track of the latest message timestamp
        if (message.timestamp > latestMessageTimestamp) {
          latestMessageTimestamp = message.timestamp;
        }

        // Check if this is a new message from the other user
        if (user && message.sender !== user && message.timestamp > lastReadMessage) {
          hasUnread = true;
        }
      });

      // Play sound if there's a new unread message but ONLY:
      // 1. When we have unread messages that we didn't know about before (!hasNewMessage)
      // 2. When we're on the homepage (to prevent sounds in the chat interface)
      // 3. When the latest message is newer than our last check (to avoid playing on initial load)
      if (hasUnread && !hasNewMessage && latestMessageTimestamp > lastReadMessage) {
        notificationSound.play().catch(e => console.log("Audio play error:", e));
      }

      setMessages(messagesData);
      setHasNewMessage(hasUnread);

      // Update document title if there's a new message
      if (hasUnread) {
        document.title = "** - CBSE Science Notes";
      } else {
        document.title = "CBSE Science Notes";
      }
    });

    return () => unsubscribe();
  }, [user, lastReadMessage, hasNewMessage]);

  // Handle starting chat and updating the last read message timestamp
  const handleStartChat = (e) => {
    // Prevent default behavior to avoid any native form submissions
    if (e) e.preventDefault();

    console.log("handleStartChat called");

    // Get the timestamp of the latest message
    if (messages.length > 0) {
      const latestTimestamp = Math.max(...messages.map(msg => msg.timestamp || 0));
      localStorage.setItem('lastReadMessage', latestTimestamp);
    }

    // Call onStartChat which will handle login state in App.jsx
    if (typeof onStartChat === 'function') {
      console.log("Calling onStartChat function");
      // Call directly without setTimeout to avoid React hook issues
      onStartChat();
    } else {
      console.error("onStartChat is not a function");
    }
  };

  return (
    <div>
      <Header>
        <p>Revision Notes</p>
        {hasNewMessage && <NotificationDot />}
      </Header>

      <Container>
        <ChapterList>
          {/* Chapter 1 */}
          <ChapterCard>
            <ChapterTitle>Chapter 1: Chemical Reactions and Equations</ChapterTitle>
            <ImportantPoints>
              <h3>Chemical Reaction and Equations</h3>
              <TopicList>
                <TopicItem>A chemical reaction is a process in which the original substance(s) loses its nature and identity and forms new substance(s) with different properties.</TopicItem>
                <TopicItem>Breaking of the chemical bonds and formation of new chemical bonds is responsible for the occurrence of a chemical reaction.</TopicItem>
                <TopicItem>The substances which take part in a chemical reaction are called Reactants.</TopicItem>
                <TopicItem>The substances which are formed in a chemical reaction are called Products.</TopicItem>
                <TopicItem>Examples of chemical reaction: Digestion of food, Respiration, Rusting of iron, Burning of magnesium ribbon, Formation of curd</TopicItem>
                <TopicItem>Chemical equations are symbolic representations of a chemical reaction using symbols and formulae.</TopicItem>
                <TopicItem>Law of conservation of mass states that "The matter can neither be created nor destroyed in a chemical reaction."</TopicItem>
                <TopicItem>Steps to balance a chemical equation: Write the skeletal equation, Count atoms on both sides, Equalize by adding coefficients, Write physical states, Write necessary conditions.</TopicItem>
              </TopicList>
              
              <h3>Types of Chemical Reactions</h3>
              <TopicList>
                <TopicItem><strong>Combination Reaction:</strong> Two or more reactants combine to form a single product. e.g., C(s) + O₂(g) → CO₂(g)</TopicItem>
                <TopicItem><strong>Decomposition Reaction:</strong> A compound splits into two or more simpler substances. Types include Thermal, Electrolytic, and Photolytic decomposition.</TopicItem>
                <TopicItem><strong>Displacement Reaction:</strong> More reactive element displaces less reactive element from its salt solution. e.g., Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)</TopicItem>
                <TopicItem><strong>Double Displacement Reaction:</strong> Mutual exchange of ions between two compounds. e.g., Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) + 2NaCl(aq)</TopicItem>
                <TopicItem><strong>Oxidation:</strong> Gain of oxygen or loss of electrons. <strong>Reduction:</strong> Gain of electrons or loss of oxygen.</TopicItem>
                <TopicItem><strong>Exothermic Reactions:</strong> Release heat (e.g., burning of natural gas, respiration). <strong>Endothermic Reactions:</strong> Absorb heat.</TopicItem>
              </TopicList>
              
              <h3>Effects of Oxidation in Everyday Life</h3>
              <TopicList>
                <TopicItem><strong>Corrosion:</strong> Deterioration of metals by action of air, moisture, chemicals. e.g., Rusting of iron, green coating on copper.</TopicItem>
                <TopicItem><strong>Prevention of Rusting:</strong> Painting, oiling, greasing, galvanizing iron.</TopicItem>
                <TopicItem><strong>Rancidity:</strong> Slow oxidation of oil and fat in food materials leading to foul odor.</TopicItem>
                <TopicItem><strong>Prevention of Rancidity:</strong> Refrigeration, air-tight containers, antioxidants, nitrogen flush packaging.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>

          {/* Chapter 2 */}
          <ChapterCard>
            <ChapterTitle>Chapter 2: Acids, Bases and Salts</ChapterTitle>
            <ImportantPoints>
              <h3>Acids and Bases</h3>
              <TopicList>
                <TopicItem><strong>Acids:</strong> Substances that furnish H⁺ ions in aqueous solution. They are sour in taste and turn blue litmus red. Examples: H₂SO₄, CH₃COOH, HNO₃.</TopicItem>
                <TopicItem><strong>Strong acids:</strong> Completely dissociate into ions (e.g., H₂SO₄, HCl). <strong>Weak acids:</strong> Partially dissociate (e.g., citric acid, acetic acid).</TopicItem>
                <TopicItem><strong>Natural acids:</strong> Vinegar (acetic acid), Orange/Lemon (citric acid), Tamarind (tartaric acid), Ant sting (methanoic acid).</TopicItem>
                <TopicItem><strong>Bases:</strong> Bitter in taste, soapy in touch, turn red litmus blue, give OH⁻ ions in solution. Examples: NaOH, KOH.</TopicItem>
                <TopicItem><strong>Strong bases:</strong> Completely ionize (e.g., KOH, NaOH). <strong>Weak bases:</strong> Partially ionize (e.g., Mg(OH)₂, Cu(OH)₂).</TopicItem>
                <TopicItem><strong>Indicators:</strong> Substances that change color/smell in different media. Types include natural (litmus, red cabbage), synthetic (phenolphthalein, methyl orange), and olfactory (onion, vanilla, clove oil).</TopicItem>
              </TopicList>
              
              <h3>Chemical Properties of Acids and Bases</h3>
              <TopicList>
                <TopicItem><strong>Reaction with Metals:</strong> Acids + Metal → Salt + H₂ gas. Bases + Metal → Salt + H₂ gas.</TopicItem>
                <TopicItem><strong>Reaction with Carbonates:</strong> Acid + Metal Carbonate → Salt + CO₂ + H₂O. Bases have no reaction.</TopicItem>
                <TopicItem><strong>Neutralization:</strong> Acid + Base → Salt + Water. H⁺ and OH⁻ ions combine to form water.</TopicItem>
                <TopicItem><strong>pH Scale:</strong> Measures H⁺ ion concentration. pH = 7 (neutral), pH &lt; 7 (acidic), pH &gt; 7 (basic).</TopicItem>
                <TopicItem><strong>Importance of pH:</strong> Human body works within pH 7-7.8. Plants require specific pH for growth. Tooth decay starts below pH 5.5.</TopicItem>
              </TopicList>
              
              <h3>Salts, Properties and Uses</h3>
              <TopicList>
                <TopicItem><strong>Salts:</strong> Ionic compounds from neutralization of acids and bases. Types: Neutral salts (pH=7), Acidic salts (pH<7), Basic salts (pH>7).</TopicItem>
                <TopicItem><strong>Common Salt (NaCl):</strong> Used in food, preservatives, and manufacture of chemicals.</TopicItem>
                <TopicItem><strong>Sodium Hydroxide (NaOH):</strong> Made via chlor-alkali process. Used in paper, soap making, and degreasing metals.</TopicItem>
                <TopicItem><strong>Bleaching Powder (CaOCl₂):</strong> Produced by action of chlorine on slaked lime. Used for bleaching, disinfecting water.</TopicItem>
                <TopicItem><strong>Baking Soda (NaHCO₃):</strong> Used in baking powder, antacids, fire extinguishers.</TopicItem>
                <TopicItem><strong>Washing Soda (Na₂CO₃·10H₂O):</strong> Used in glass, soap, paper industries and for removing water hardness.</TopicItem>
                <TopicItem><strong>Plaster of Paris (CaSO₄·½H₂O):</strong> Used for supporting fractured bones, making toys, decorative materials.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>

          {/* Chapter 3 */}
          <ChapterCard>
            <ChapterTitle>Chapter 3: Metals and Non-metals</ChapterTitle>
            <ImportantPoints>
              <h3>Physical Properties of Metals and Non-metals</h3>
              <TopicList>
                <TopicItem><strong>Metals:</strong> Generally have lustre, are hard (except Na, Li, K), exist as solids (except Hg), are malleable and ductile, good conductors of heat and electricity, have high density and melting point, are sonorous, form basic oxides.</TopicItem>
                <TopicItem><strong>Non-metals:</strong> Generally lack lustre (except iodine), are soft (except diamond), exist as solids or gases (except Br), are non-malleable and non-ductile, poor conductors (except graphite), have low density and melting point, are not sonorous, form acidic oxides.</TopicItem>
              </TopicList>
              
              <h3>Chemical Properties of Metals</h3>
              <TopicList>
                <TopicItem><strong>Reaction with Air:</strong> Metals + O₂ → Metal oxide. Reactivity varies: Na/K are very reactive; Au/Ag don't react.</TopicItem>
                <TopicItem><strong>Amphoteric Oxides:</strong> Metal oxides that react with both acids and bases. e.g., Al₂O₃.</TopicItem>
                <TopicItem><strong>Reaction with Water:</strong> Metal + Water → Metal oxide/hydroxide + H₂. Na/K react vigorously; Ag/Au don't react.</TopicItem>
                <TopicItem><strong>Reaction with Acids:</strong> Metal + Dilute Acid → Salt + H₂ gas. Cu, Hg, Ag don't react with dilute acids.</TopicItem>
                <TopicItem><strong>Displacement Reactions:</strong> More reactive metals displace less reactive ones from their compounds. e.g., Fe + CuSO₄ → FeSO₄ + Cu</TopicItem>
                <TopicItem><strong>Reactivity Series:</strong> K > Na > Ca > Mg > Al > Zn > Fe > Sn > Pb > H > Cu > Hg > Ag > Au > Pt</TopicItem>
              </TopicList>
              
              <h3>Chemical Properties of Non-metals</h3>
              <TopicList>
                <TopicItem><strong>Reaction with Oxygen:</strong> Non-metals + O₂ → Acidic oxides. e.g., C + O₂ → CO₂</TopicItem>
                <TopicItem><strong>Reaction with Water:</strong> Generally no reaction.</TopicItem>
                <TopicItem><strong>Reaction with Acids:</strong> No reaction.</TopicItem>
                <TopicItem><strong>Reaction with Chlorine/Hydrogen:</strong> Form respective chlorides/hydrides.</TopicItem>
              </TopicList>
              
              <h3>Ionic Compounds and Metallurgy</h3>
              <TopicList>
                <TopicItem><strong>Ionic Compounds:</strong> Formed by transfer of electrons. Properties: solid/hard, high melting/boiling points, soluble in water, conduct electricity in molten/solution form.</TopicItem>
                <TopicItem><strong>Minerals and Ores:</strong> Minerals are naturally occurring elements/compounds. Ores are minerals from which metals can be profitably extracted.</TopicItem>
                <TopicItem><strong>Extraction of Metals:</strong> Steps include concentration of ore, extraction from concentrated ore, and refining.</TopicItem>
                <TopicItem><strong>Corrosion:</strong> Deterioration of metals by reaction with environment. Prevention: painting, oiling, greasing, galvanizing.</TopicItem>
                <TopicItem><strong>Alloys:</strong> Homogeneous mixtures of metals or metals and non-metals. e.g., Stainless steel, Brass, Bronze, Solder.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button" onClick={handleStartChat}>Download Notes</DownloadBtn>
          </ChapterCard>

          {/* Chapter 4 */}
          <ChapterCard>
            <ChapterTitle>Chapter 4: Carbon and its Compounds</ChapterTitle>
            <ImportantPoints>
              <h3>Carbon and its Properties</h3>
              <TopicList>
                <TopicItem><strong>Carbon:</strong> Non-metal with symbol C. Forms 0.02% of Earth's crust and 0.03% of atmosphere as CO₂. All living things contain carbon compounds.</TopicItem>
                <TopicItem><strong>Properties:</strong> Carbon is tetravalent and always forms covalent bonds. Atomic number is 6, with electronic configuration K(2)L(4).</TopicItem>
                <TopicItem><strong>Covalent Bond:</strong> Formed by sharing of electrons between atoms. Conditions: atoms should have 4-7 valence electrons, not easily lose/gain electrons, low electronegativity difference.</TopicItem>
                <TopicItem><strong>Properties of Covalent Compounds:</strong> Generally liquids/gases, insoluble in water but soluble in organic solvents, low melting/boiling points, don't conduct electricity.</TopicItem>
                <TopicItem><strong>Versatile Nature:</strong> Carbon forms numerous compounds due to catenation (ability to form chains) and tetravalency.</TopicItem>
              </TopicList>
              
              <h3>Hydrocarbons and Homologous Series</h3>
              <TopicList>
                <TopicItem><strong>Hydrocarbons:</strong> Compounds of hydrogen and carbon. Types: Straight chain, Branched chain, Cyclic.</TopicItem>
                <TopicItem><strong>Saturated Hydrocarbons (Alkanes):</strong> Single bonds between carbon atoms. General formula CₙH₂ₙ₊₂.</TopicItem>
                <TopicItem><strong>Unsaturated Hydrocarbons:</strong> Alkenes (double bond, CₙH₂ₙ) and Alkynes (triple bond, CₙH₂ₙ₋₂).</TopicItem>
                <TopicItem><strong>Homologous Series:</strong> Series where each member differs by -CH₂ group. Members have similar chemical properties but gradual change in physical properties.</TopicItem>
                <TopicItem><strong>Functional Groups:</strong> Atoms/groups that replace hydrogen in hydrocarbons and determine properties. e.g., -OH (alcohol), -CHO (aldehyde), -COOH (carboxylic acid).</TopicItem>
                <TopicItem><strong>IUPAC Nomenclature:</strong> Systematic naming using word roots (number of carbon atoms) and suffixes (bond types): -ane (single), -ene (double), -yne (triple).</TopicItem>
              </TopicList>
              
              <h3>Chemical Properties and Compounds</h3>
              <TopicList>
                <TopicItem><strong>Chemical Reactions:</strong> Combustion (burning in air), Oxidation (converting alcohols to acids), Addition (in unsaturated hydrocarbons), Substitution (in saturated hydrocarbons).</TopicItem>
                <TopicItem><strong>Ethanol (C₂H₅OH):</strong> Reacts with sodium to form sodium ethoxide, undergoes esterification with acids. Used in soaps, cosmetics, medicines.</TopicItem>
                <TopicItem><strong>Ethanoic Acid (CH₃COOH):</strong> Common name acetic acid. Reacts with carbonates, bases, alcohols. Found in vinegar (5-8% solution).</TopicItem>
                <TopicItem><strong>Soaps and Detergents:</strong> Soaps are sodium/potassium salts of fatty acids, effective in soft water. Detergents work in both hard and soft water.</TopicItem>
                <TopicItem><strong>Cleansing Action:</strong> Soap molecules form micelles around dirt particles, allowing them to be washed away with water.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">
              Download Notes
            </DownloadBtn>
          </ChapterCard>

          {/* Chapter 5 */}
          <ChapterCard>
            <ChapterTitle>Chapter 5: Life Processes</ChapterTitle>
            <ImportantPoints>
              <h3>Nutrition</h3>
              <TopicList>
                <TopicItem><strong>Life Processes:</strong> Basic functions performed by living organisms for survival and maintenance: growth, digestion, respiration, circulation, excretion, reproduction.</TopicItem>
                <TopicItem><strong>Nutrition Types:</strong> Autotrophic (organisms prepare their own food, e.g., plants) and Heterotrophic (organisms take food from others, e.g., animals).</TopicItem>
                <TopicItem><strong>Photosynthesis:</strong> Process where green plants make food using CO₂, H₂O, sunlight, and chlorophyll, producing O₂ as byproduct. Takes place in chloroplasts.</TopicItem>
                <TopicItem><strong>Human Digestive System:</strong> Consists of alimentary canal (mouth to anus) and digestive glands (salivary, gastric, liver, pancreas). Different regions perform specialized functions.</TopicItem>
              </TopicList>
              
              <h3>Respiration</h3>
              <TopicList>
                <TopicItem><strong>Respiration:</strong> Process involving breathing (gas exchange) and breakdown of food for energy. Types: Aerobic (with oxygen) and Anaerobic (without oxygen).</TopicItem>
                <TopicItem><strong>Aerobic Respiration:</strong> Occurs in mitochondria, produces CO₂, H₂O, and more energy. Anaerobic Respiration produces alcohol or lactic acid with less energy.</TopicItem>
                <TopicItem><strong>Human Respiratory System:</strong> Consists of nostrils, nasal cavity, pharynx, larynx, trachea, bronchi, bronchioles, alveoli, and lungs. Gas exchange occurs in alveoli.</TopicItem>
                <TopicItem><strong>Breathing:</strong> Inspiration (active intake of air) and Expiration (passive expelling of air). Haemoglobin carries oxygen from lungs to tissues.</TopicItem>
                <TopicItem><strong>Respiration in Other Organisms:</strong> Unicellular animals use diffusion, earthworms use skin, aquatic animals use gills, insects use spiracles, land animals use lungs.</TopicItem>
              </TopicList>
              
              <h3>Circulation and Transportation</h3>
              <TopicList>
                <TopicItem><strong>Human Circulatory System:</strong> Consists of blood, blood vessels, and heart. Heart is four-chambered with two atria and two ventricles.</TopicItem>
                <TopicItem><strong>Double Circulation:</strong> Blood passes through heart twice in one cycle - Pulmonary circulation (heart-lungs-heart) and Systemic circulation (heart-body-heart).</TopicItem>
                <TopicItem><strong>Blood Vessels:</strong> Arteries carry blood away from heart, veins carry blood to heart, capillaries connect arteries to veins and allow exchange of materials.</TopicItem>
                <TopicItem><strong>Plant Transportation:</strong> Xylem transports water and minerals upward (no energy required), phloem transports food (requires energy).</TopicItem>
                <TopicItem><strong>Transpiration:</strong> Loss of water vapor from aerial parts of plants. Translocation is transport of food from leaves to other parts.</TopicItem>
              </TopicList>
              
              <h3>Excretion</h3>
              <TopicList>
                <TopicItem><strong>Excretion:</strong> Removal of harmful metabolic nitrogenous wastes from the body.</TopicItem>
                <TopicItem><strong>Human Excretory System:</strong> Consists of kidneys, ureters, urinary bladder, and urethra. Nephrons in kidneys filter blood and form urine.</TopicItem>
                <TopicItem><strong>Urine Formation:</strong> Involves glomerular filtration, tubular reabsorption, and secretion. About 180L of filtrate forms daily, but only 2L is excreted as urine.</TopicItem>
                <TopicItem><strong>Haemodialysis:</strong> Process of purifying blood by artificial kidney in case of kidney failure.</TopicItem>
                <TopicItem><strong>Plant Excretion:</strong> Plants excrete oxygen, CO₂, and water through stomata via transpiration.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
          
          {/* Chapter 6 */}
          <ChapterCard>
            <ChapterTitle>Chapter 6: Control and Co-ordination</ChapterTitle>
            <ImportantPoints>
              <h3>Control and Co-ordination in Plants</h3>
              <TopicList>
                <TopicItem><strong>Plant Movements:</strong> Responses to external stimuli like light, gravity, chemicals. Two types: dependent on growth and independent of growth.</TopicItem>
                <TopicItem><strong>Tropic Movements:</strong> Directional growth in response to stimulus. Positive tropism is growth towards stimulus, negative is away from stimulus.</TopicItem>
                <TopicItem><strong>Types of Tropisms:</strong> Phototropism (light), Geotropism (gravity), Chemotropism (chemicals), Hydrotropism (water), Thigmotropism (touch).</TopicItem>
                <TopicItem><strong>Plant Hormones:</strong> Chemical compounds that control growth and functions. Main types: Auxins (synthesized at shoot tip, helps cells grow), Gibberellins (stem growth), Cytokinins (cell division), Abscisic Acid (growth inhibitor, "stress hormone"), Ethylene (fruit ripening).</TopicItem>
              </TopicList>
              
              <h3>Control and Co-ordination in Animals</h3>
              <TopicList>
                <TopicItem><strong>Nervous System:</strong> Network of nerves that receives stimuli and transmits responses. Basic unit is neuron, consisting of cell body, dendrites, axon, myelin sheath, and synapse.</TopicItem>
                <TopicItem><strong>Neuron Function:</strong> Dendrites receive impulses, cell body processes them, axon transmits them to nerve endings, which pass them across synapses to next neuron.</TopicItem>
                <TopicItem><strong>Action Types:</strong> Voluntary (controlled by conscious thought, e.g., speaking), Involuntary (automatic, e.g., heartbeat), Reflex action (quick response to stimulus, e.g., withdrawing hand from hot object).</TopicItem>
                <TopicItem><strong>Human Brain:</strong> Has three major parts: Forebrain (thinking, voluntary actions, memory), Midbrain (controls involuntary actions), Hindbrain (posture, balance, involuntary functions).</TopicItem>
              </TopicList>
              
              <h3>Endocrine System</h3>
              <TopicList>
                <TopicItem><strong>Endocrine System:</strong> Comprises glands that secrete hormones directly into bloodstream. Hormones are chemical messengers that act on target tissues/organs.</TopicItem>
                <TopicItem><strong>Major Glands:</strong> Hypothalamus (regulates pituitary), Pituitary (growth), Thyroid (metabolism), Adrenal (stress response), Pancreas (glucose regulation), Testes/Ovaries (sexual characteristics).</TopicItem>
                <TopicItem><strong>Hormonal Disorders:</strong> Dwarfism (growth hormone deficiency), Gigantism (excess growth hormone), Goitre (iodine deficiency), Diabetes (insulin deficiency).</TopicItem>
                <TopicItem><strong>Feedback Mechanisms:</strong> Ensure hormones are secreted in precise quantities at right times, preventing harmful effects of excess/deficiency.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
          
          {/* Chapter 7 */}
          <ChapterCard>
            <ChapterTitle>Chapter 7: Reproduction</ChapterTitle>
            <ImportantPoints>
              <h3>Asexual Reproduction and Vegetative Propagation</h3>
              <TopicList>
                <TopicItem><strong>Reproduction:</strong> Process by which organisms produce new individuals similar to themselves, ensuring continuity of life. DNA (hereditary material) replicates and forms new cells with variations.</TopicItem>
                <TopicItem><strong>Types of Reproduction:</strong> Asexual (single parent, no gametes, identical offspring) and Sexual (two parents, gametes formed, offspring with variations).</TopicItem>
                <TopicItem><strong>Asexual Reproduction:</strong> Methods include: Fission (binary/multiple), Fragmentation (body breaks into pieces), Regeneration (regrowth from body parts), Budding (outgrowth becomes new organism), Vegetative propagation (new plants from vegetative parts), Spore formation.</TopicItem>
                <TopicItem><strong>Vegetative Propagation:</strong> Natural methods (roots - Dahlia, stems - Potato, leaves - Bryophyllum) and Artificial methods (grafting, cutting, layering, tissue culture).</TopicItem>
              </TopicList>
              
              <h3>Sexual Reproduction in Plants</h3>
              <TopicList>
                <TopicItem><strong>Flower Parts:</strong> Sepals, petals, stamens (male reproductive parts with pollen), carpels (female reproductive parts with ovules).</TopicItem>
                <TopicItem><strong>Pollination:</strong> Transfer of pollen from anther to stigma. Types: Self-pollination (same flower) and Cross-pollination (different flowers, introduces variations).</TopicItem>
                <TopicItem><strong>Fertilization:</strong> Fusion of male and female gametes to form zygote. In flowering plants, double fertilization occurs - one sperm fertilizes egg, another fertilizes secondary nucleus.</TopicItem>
                <TopicItem><strong>Post-fertilization:</strong> Ovule develops into seed, ovary into fruit. Seed contains embryo (future plant) with seed coat, cotyledons, and embryonal axis (plumule and radicle).</TopicItem>
              </TopicList>
              
              <h3>Reproduction in Human Beings</h3>
              <TopicList>
                <TopicItem><strong>Puberty:</strong> Period of sexual maturation when production of germ cells (ova/sperm) begins. Changes include: hair growth in armpits/genitals, oily skin, breast development and menstruation in girls, facial hair and voice changes in boys.</TopicItem>
                <TopicItem><strong>Male Reproductive System:</strong> Testes (produce sperm and testosterone), vas deferens (transports sperm), urethra (common passage for sperm/urine), associated glands (provide nourishment to sperm).</TopicItem>
                <TopicItem><strong>Female Reproductive System:</strong> Ovaries (produce eggs), fallopian tubes/oviducts (site of fertilization), uterus (development of fetus), vagina (birth canal).</TopicItem>
                <TopicItem><strong>Reproductive Health:</strong> Aspects of general health related to reproductive life. Includes prevention of STDs (gonorrhea, syphilis, HIV-AIDS) and birth control methods (physical barriers, chemical methods, IUCDs, surgical methods).</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
          
          {/* Chapter 8 */}
          <ChapterCard>
            <ChapterTitle>Chapter 8: Heredity and Evolution</ChapterTitle>
            <ImportantPoints>
              <h3>Heredity</h3>
              <TopicList>
                <TopicItem><strong>Variations:</strong> Arise during sexual reproduction due to inaccuracies in DNA copying and crossing over during meiosis. Beneficial variations help species survive in changing environments.</TopicItem>
                <TopicItem><strong>Mendel's Work:</strong> Gregor Johann Mendel, "Father of Genetics," studied inheritance in garden pea (Pisum sativum) using seven pairs of contrasting characters.</TopicItem>
                <TopicItem><strong>Monohybrid Cross:</strong> Cross between plants with one pair of contrasting characters. F2 generation shows phenotypic ratio of 3:1 and genotypic ratio of 1:2:1.</TopicItem>
                <TopicItem><strong>Dihybrid Cross:</strong> Cross between plants with two pairs of contrasting characters. F2 generation shows phenotypic ratio of 9:3:3:1.</TopicItem>
              </TopicList>
              
              <h3>Mendel's Laws and Sex Determination</h3>
              <TopicList>
                <TopicItem><strong>Law of Dominance:</strong> When parents with pure contrasting characters are crossed, only dominant character expresses in F1 generation.</TopicItem>
                <TopicItem><strong>Law of Segregation:</strong> Every individual has pair of alleles for a trait. During gamete formation, only one allele is received.</TopicItem>
                <TopicItem><strong>Law of Independent Assortment:</strong> Alleles of different characters separate independently during gamete formation.</TopicItem>
                <TopicItem><strong>Sex Determination in Humans:</strong> 23 pairs of chromosomes (22 autosomal, 1 sex chromosome). Males have XY, females XX. Father determines child's sex - X-carrying sperm produces girl, Y-carrying sperm produces boy.</TopicItem>
                <TopicItem><strong>Acquired vs. Inherited Traits:</strong> Acquired traits (e.g., low weight of beetles) are not passed to offspring. Inherited traits (e.g., eye color, hair color) are passed genetically.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
          
          {/* Chapter 9 */}
          <ChapterCard>
            <ChapterTitle>Chapter 9: Light Reflection and Refraction</ChapterTitle>
            <ImportantPoints>
              <h3>Reflection of Light</h3>
              <TopicList>
                <TopicItem><strong>Reflection:</strong> Phenomenon of bouncing back of light rays in same medium. Laws: (1) Incident ray, reflected ray, and normal lie in same plane, (2) Angle of incidence equals angle of reflection.</TopicItem>
                <TopicItem><strong>Image Types:</strong> Real image (rays actually meet, can be obtained on screen) and Virtual image (rays appear to meet, cannot be obtained on screen).</TopicItem>
                <TopicItem><strong>Plane Mirror Image:</strong> Virtual, erect, same size as object, as far behind mirror as object is in front, laterally inverted.</TopicItem>
                <TopicItem><strong>Spherical Mirrors:</strong> Concave (reflecting surface recessed inward) and Convex (reflecting surface bulges outward). Concave mirrors mostly form real images, convex mirrors always form virtual images.</TopicItem>
              </TopicList>
              
              <h3>Mirror Terminology and Formulas</h3>
              <TopicList>
                <TopicItem><strong>Mirror Terminology:</strong> Pole (center of reflecting surface), Principal axis (line through pole and center of curvature), Center of curvature (center of sphere), Radius of curvature (radius of sphere), Principal focus (point where parallel rays converge after reflection).</TopicItem>
                <TopicItem><strong>Mirror Formula:</strong> 1/v + 1/u = 1/f (where v=image distance, u=object distance, f=focal length). Relation: Radius of curvature (R) = 2 × focal length (f).</TopicItem>
                <TopicItem><strong>Magnification:</strong> m = h₂/h₁ = -v/u. Negative m means real image, positive m means virtual image. If |m|=1, image equals object size; if |m|>1, image is enlarged; if |m|<1, image is diminished.</TopicItem>
                <TopicItem><strong>Image Formation by Concave Mirror:</strong> Position and nature of image changes based on object position (at infinity, beyond C, at C, between C and F, at F, between P and F).</TopicItem>
                <TopicItem><strong>Image Formation by Convex Mirror:</strong> Always forms virtual, erect, diminished image behind mirror.</TopicItem>
              </TopicList>
              
              <h3>Refraction and Lenses</h3>
              <TopicList>
                <TopicItem><strong>Refraction:</strong> Change in path of light when passing from one medium to another, caused by change in speed. When light goes from rarer to denser medium, it bends toward normal; from denser to rarer, it bends away.</TopicItem>
                <TopicItem><strong>Laws of Refraction:</strong> (1) Incident ray, refracted ray, and normal lie in same plane, (2) Snell's Law: sin i/sin r = constant (refractive index).</TopicItem>
                <TopicItem><strong>Refractive Index:</strong> Ratio of speed of light in two media or ratio of sine of angle of incidence to sine of angle of refraction.</TopicItem>
                <TopicItem><strong>Lens Formula:</strong> 1/v - 1/u = 1/f. Power of lens = 1/f (in meters), measured in diopters (D).</TopicItem>
                <TopicItem><strong>Image Formation by Convex Lens:</strong> Nature, position, and size vary with object position. Image can be real or virtual, inverted or erect, diminished or enlarged.</TopicItem>
                <TopicItem><strong>Image Formation by Concave Lens:</strong> Always forms virtual, erect, diminished image between focus and optical center.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
          
          {/* Chapter 10 */}
          <ChapterCard>
            <ChapterTitle>Chapter 10: Human Eye and Colourful World</ChapterTitle>
            <ImportantPoints>
              <h3>Human Eye</h3>
              <TopicList>
                <TopicItem><strong>Human Eye:</strong> Natural optical device that forms inverted, real image on retina. Contains rods (respond to light intensity) and cones (respond to colors) that generate signals transmitted to brain via optic nerve.</TopicItem>
                <TopicItem><strong>Eye Parts:</strong> Cornea (outermost transparent part), Lens (provides focusing), Iris (controls pupil size), Pupil (regulates light entering eye), Retina (light-sensitive cells), Ciliary muscles (change lens shape).</TopicItem>
                <TopicItem><strong>Near and Far Points:</strong> Far point is maximum distance for clear vision (infinity for normal eye). Near point is minimum distance for distinct vision (25 cm for normal eye).</TopicItem>
                <TopicItem><strong>Accommodation:</strong> Ability of eye lens to adjust focal length using ciliary muscles.</TopicItem>
              </TopicList>
              
              <h3>Vision Defects and Corrections</h3>
              <TopicList>
                <TopicItem><strong>Myopia (Nearsightedness):</strong> Distant objects not clearly visible, image forms in front of retina. Far point is less than infinity. Corrected with concave lens.</TopicItem>
                <TopicItem><strong>Hypermetropia (Farsightedness):</strong> Nearby objects not clearly visible, image forms behind retina. Near point is beyond 25 cm. Corrected with convex lens.</TopicItem>
                <TopicItem><strong>Presbyopia:</strong> Age-related farsightedness due to decreased accommodation power. Near point recedes beyond 25 cm. Corrected with convex lens.</TopicItem>
              </TopicList>
              
              <h3>Light Phenomena</h3>
              <TopicList>
                <TopicItem><strong>Dispersion:</strong> Splitting of white light into constituent colors through prism. Different colors undergo different deviations. Spectrum is band of colored components.</TopicItem>
                <TopicItem><strong>Atmospheric Refraction:</strong> Bending of light passing through Earth's atmosphere due to density variation. Causes twinkling of stars, early sunrise and late sunset.</TopicItem>
                <TopicItem><strong>Scattering of Light:</strong> Redirection of light by particles. Small particles scatter shorter wavelengths better (blue light); larger particles scatter all wavelengths equally.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
          
          {/* Chapter 11 */}
          <ChapterCard>
            <ChapterTitle>Chapter 11: Electricity</ChapterTitle>
            <ImportantPoints>
              <h3>Electric Current and Circuits</h3>
              <TopicList>
                <TopicItem><strong>Electric Current:</strong> Rate of flow of electric charge through conductor. I = Q/t. Unit is Ampere (A): 1 Coulomb charge flowing per second.</TopicItem>
                <TopicItem><strong>Electric Circuit:</strong> Closed path for current flow. Components include cells, batteries, switches, resistors, meters. Current flows conventionally from positive to negative terminal.</TopicItem>
                <TopicItem><strong>Electric Potential:</strong> Electric potential energy at a point. Potential difference (voltage) is work done to move unit charge between two points. Unit is Volt (V): 1 Joule work per Coulomb charge.</TopicItem>
                <TopicItem><strong>Measuring Instruments:</strong> Ammeter (measures current, connected in series, low resistance) and Voltmeter (measures potential difference, connected in parallel, high resistance).</TopicItem>
              </TopicList>
              
              <h3>Ohm's Law and Resistance</h3>
              <TopicList>
                <TopicItem><strong>Ohm's Law:</strong> Current through conductor is directly proportional to voltage across it at constant temperature. V = IR. Graph of V vs I is straight line with slope equal to resistance.</TopicItem>
                <TopicItem><strong>Resistance (R):</strong> Property of conductor to resist charge flow. Unit is Ohm (Ω): 1 Volt per Ampere. Factors affecting resistance: length (directly proportional), area (inversely proportional), temperature, material.</TopicItem>
                <TopicItem><strong>Resistivity (ρ):</strong> Resistance of unit length and unit cross-section. Unit is Ohm-meter (Ωm). Independent of length/area but changes with temperature. Metals/alloys: 10⁻⁸-10⁻⁶ Ωm, Insulators: 10¹²-10¹⁷ Ωm.</TopicItem>
                <TopicItem><strong>Series Combination:</strong> Total resistance = Sum of individual resistances (Rs = R₁ + R₂ + R₃ + ...).</TopicItem>
                <TopicItem><strong>Parallel Combination:</strong> Reciprocal of total resistance = Sum of reciprocals of individual resistances (1/Rp = 1/R₁ + 1/R₂ + 1/R₃ + ...).</TopicItem>
              </TopicList>
              
              <h3>Heating Effect and Power</h3>
              <TopicList>
                <TopicItem><strong>Joule's Law of Heating:</strong> Heat produced in conductor is directly proportional to square of current, resistance, and time. H = I²Rt. Used in electric irons, heaters, bulbs.</TopicItem>
                <TopicItem><strong>Electric Energy:</strong> Work done to maintain current. W = VIt = I²Rt. Commercial unit is kilowatt-hour (kWh or 'unit'): 3.6×10⁶ J.</TopicItem>
                <TopicItem><strong>Electric Power:</strong> Rate of energy consumption. P = VI = I²R = V²/R. Unit is Watt (W): 1 Joule per second or 1 Volt-Ampere.</TopicItem>
                <TopicItem><strong>Electric Fuse:</strong> Safety device that protects against short circuit/overloading. Made of tin/copper-tin alloy with low melting point, connected in series with live wire.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
          
          {/* Chapter 12 */}
          <ChapterCard>
            <ChapterTitle>Chapter 12: Magnetic Effects of Electric Current</ChapterTitle>
            <ImportantPoints>
              <h3>Magnetic Field and Effects</h3>
              <TopicList>
                <TopicItem><strong>Magnet:</strong> Substance that attracts iron or iron-like materials. Has North and South poles. Like poles repel, unlike attract. Freely suspended magnet aligns North-South.</TopicItem>
                <TopicItem><strong>Magnetic Field:</strong> Area around magnet where magnetic force is experienced. Unit is Tesla (T). Represented by field lines that arise from North pole, end at South pole, never intersect, and are closer in stronger field.</TopicItem>
                <TopicItem><strong>Magnetic Field Due to Current:</strong> H.C. Oersted discovered electrical current produces magnetic field. Right Hand Thumb Rule gives direction: thumb points in current direction, fingers curl in field direction.</TopicItem>
                <TopicItem><strong>Magnetic Field of Straight Conductor:</strong> Concentric circles around wire. Strength proportional to current, inversely proportional to distance from conductor.</TopicItem>
              </TopicList>
              
              <h3>Electromagnetic Applications</h3>
              <TopicList>
                <TopicItem><strong>Magnetic Field of Circular Loop:</strong> Concentric circles, same direction inside loop. Field strength increases with current and number of turns, decreases with distance.</TopicItem>
                <TopicItem><strong>Solenoid:</strong> Coil of many circular turns of wire. Acts like bar magnet with one end as North pole, other as South pole. Field lines outside go from North to South, inside from South to North.</TopicItem>
                <TopicItem><strong>Electromagnets:</strong> Temporary magnets made by placing iron core in current-carrying coil. Used in electric bells, motors, generators.</TopicItem>
                <TopicItem><strong>Force on Current-Carrying Conductor:</strong> F = IBl sin θ. Fleming's Left Hand Rule: Thumb (motion/force), Forefinger (magnetic field), Middle finger (current) are mutually perpendicular.</TopicItem>
              </TopicList>
              
              <h3>Electric Currents and Circuits</h3>
              <TopicList>
                <TopicItem><strong>Direct Current (DC):</strong> Current flows in one direction. Sources: cells, batteries. Can be stored but has high energy loss over distance.</TopicItem>
                <TopicItem><strong>Alternating Current (AC):</strong> Current reverses direction periodically (50 Hz in India). Generated by power stations, cannot be stored, has low energy loss over distance.</TopicItem>
                <TopicItem><strong>Domestic Electric Circuits:</strong> AC supply (220V, 50Hz) with three wires: Live (red, positive), Neutral (black, negative), Earth (green, safety).</TopicItem>
                <TopicItem><strong>Safety Devices:</strong> Electric fuse (protects against short circuit/overloading) and Earth wire (transfers leakage current to ground, prevents shock).</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
          
          {/* Chapter 13 */}
          <ChapterCard>
            <ChapterTitle>Chapter 13: Our Environment</ChapterTitle>
            <ImportantPoints>
              <h3>Ecosystem and Food Chain</h3>
              <TopicList>
                <TopicItem><strong>Environment:</strong> Everything that surrounds us, including living (biotic) and non-living (abiotic) components.</TopicItem>
                <TopicItem><strong>Ecosystem:</strong> Interacting organisms in area together with non-living components. Types: Natural (forest, lake) and Artificial (crop field, aquarium).</TopicItem>
                <TopicItem><strong>Ecosystem Components:</strong> Producers (green plants, algae), Consumers (herbivores, carnivores, omnivores, parasites), Decomposers (microorganisms breaking down dead matter).</TopicItem>
                <TopicItem><strong>Food Chain:</strong> Sequence of organisms through which energy flows. Example: Grass → Grasshopper → Frog → Snake → Eagle. First link is producer, last is decomposer.</TopicItem>
              </TopicList>
              
              <h3>Energy Flow and Biological Magnification</h3>
              <TopicList>
                <TopicItem><strong>Trophic Levels:</strong> Steps in food chain where energy transfer occurs. Producers (first), Herbivores (second), Carnivores (third and fourth).</TopicItem>
                <TopicItem><strong>Food Web:</strong> Network of interconnected food chains. Organism can occupy multiple trophic levels in food web.</TopicItem>
                <TopicItem><strong>Energy Flow:</strong> Unidirectional through food chain. Only 10% passes to next level, 90% used for metabolism/maintenance at current level.</TopicItem>
                <TopicItem><strong>10 Percent Law:</strong> Only 10% energy transfers to next trophic level. Limits food chain length to 3-4 levels.</TopicItem>
                <TopicItem><strong>Biological Magnification:</strong> Concentration of harmful chemicals increases at each trophic level. Highest in top consumers (humans).</TopicItem>
              </TopicList>
              
              <h3>Waste Management and Environmental Issues</h3>
              <TopicList>
                <TopicItem><strong>Waste Types:</strong> Biodegradable (decomposed by microorganisms, e.g., food waste, paper) and Non-biodegradable (not easily decomposed, e.g., plastic, metals, radioactive waste).</TopicItem>
                <TopicItem><strong>Waste Disposal Methods:</strong> Biogas plant, Sewage treatment, Land filling, Composting, Recycling, Reuse. Biodegradable and non-biodegradable waste should be discarded separately.</TopicItem>
                <TopicItem><strong>Ozone Layer:</strong> Layer in stratosphere (20-30km above Earth) containing ozone (O₃) that shields Earth from UV radiation. Formed by UV rays splitting oxygen molecules.</TopicItem>
                <TopicItem><strong>Ozone Depletion:</strong> Reduction in ozone concentration due to chlorofluorocarbons (CFCs) and nitrogen monoxide. Creates "ozone hole" allowing more UV radiation to reach Earth.</TopicItem>
                <TopicItem><strong>Protection Efforts:</strong> Montreal Protocol (1987) and Kyoto Protocol control emission of ozone-depleting substances.</TopicItem>
              </TopicList>
            </ImportantPoints>
            <DownloadBtn className="chat-button">Download Notes</DownloadBtn>
          </ChapterCard>
        </ChapterList>
      </Container>
    </div>
  );
};

// Styled components
const Header = styled.div`
  text-align: center;
  padding: 20px 0;
  background-color: rgba(17, 25, 40, 0.75);
  color: white;
  position: relative;
`;

const NotificationDot = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 14px;
  height: 14px;
  background-color: blue;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  overflow-y: auto;
  height: calc(120vh - 130px); /* Adjust height based on header */
  -webkit-overflow-scrolling: touch; /* Smoother scrolling on iOS */
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #004685;
    border-radius: 10px;
  }
`;

const ChapterList = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 20px;
`;

const ChapterCard = styled.div`
  background: rgba(17, 25, 40, 0.75);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  padding: 20px;
  width: 100%;
`;

const ChapterTitle = styled.h2`
  color: #004685;
  margin-bottom: 15px;
`;

const ImportantPoints = styled.div`
  background-color: rgba(17, 25, 40, 3);
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
  color: blue;
`;

const TopicList = styled.ul`
  margin-left: 20px;
`;

const TopicItem = styled.li`
  margin: 10px 0;
`;

const DownloadBtn = styled.button`
  background-color: rgba(17, 25, 40, 3);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
`;

const ChatButton = styled.button`
  background-color: #004685;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 20px 0;
  font-size: 16px;
  position: relative;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #003366;
  }
`;

const ButtonNotificationDot = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  background-color: #4CAF50;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
`;

export default HomePage;