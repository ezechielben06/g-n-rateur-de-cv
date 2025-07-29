import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import AuthorInfo from './author';

const App = () => {
  // États pour les données du CV
  const [cvData, setCvData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    education: '',
    skills: '',
  });
  
  // États pour l'UI
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [profileImage, setProfileImage] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const fileInputRef = useRef(null);
  const cvPreviewRef = useRef(null);

  // Gestion des changements dans les inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Déclencheur pour le file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Export en PDF
  const handleExportPDF = async () => {
    if (!cvPreviewRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const canvas = await html2canvas(cvPreviewRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cvData.firstName}_${cvData.lastName}_CV.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Templates de CV
  const templates = {
    template1: () => (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto font-sans">
        <div className="flex items-start mb-8">
          {profileImage && (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-28 h-28 rounded-full object-cover mr-6 border-4 border-blue-100"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {cvData.firstName} <span className="text-blue-600">{cvData.lastName}</span>
            </h1>
            <h2 className="text-xl text-gray-600 mb-2">{cvData.title}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
              {cvData.email && <span><i className="fas fa-envelope mr-1"></i> {cvData.email}</span>}
              {cvData.phone && <span><i className="fas fa-phone mr-1"></i> {cvData.phone}</span>}
              {cvData.address && <span><i className="fas fa-map-marker-alt mr-1"></i> {cvData.address}</span>}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {cvData.experience && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Expérience Professionnelle</h3>
              <p className="text-gray-700 whitespace-pre-line">{cvData.experience}</p>
            </div>
          )}
          
          {cvData.education && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Formation</h3>
              <p className="text-gray-700 whitespace-pre-line">{cvData.education}</p>
            </div>
          )}
          
          {cvData.skills && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.split('\n').filter(skill => skill.trim()).map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    
    template2: () => (
      <div className="bg-gray-50 p-8 rounded-lg shadow-lg max-w-2xl mx-auto font-serif">
        <div className="text-center mb-8">
          {profileImage && (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
            />
          )}
          <h1 className="text-4xl font-bold text-gray-800">
            {cvData.firstName} <span className="text-teal-700">{cvData.lastName}</span>
          </h1>
          <h2 className="text-2xl text-gray-600 mt-2">{cvData.title}</h2>
          
          {(cvData.email || cvData.phone || cvData.address) && (
            <div className="flex justify-center space-x-4 mt-4 text-gray-600">
              {cvData.email && <span><i className="fas fa-envelope mr-1"></i> {cvData.email}</span>}
              {cvData.phone && <span><i className="fas fa-phone mr-1"></i> {cvData.phone}</span>}
              {cvData.address && <span><i className="fas fa-map-marker-alt mr-1"></i> {cvData.address}</span>}
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {cvData.experience && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-1 mb-3">EXPÉRIENCE</h3>
                <p className="text-gray-700 whitespace-pre-line">{cvData.experience}</p>
              </div>
            )}
          </div>
          
          <div>
            {cvData.education && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-1 mb-3">FORMATION</h3>
                <p className="text-gray-700 whitespace-pre-line">{cvData.education}</p>
              </div>
            )}
            
            {cvData.skills && (
              <div>
                <h3 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-1 mb-3">COMPÉTENCES</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {cvData.skills.split('\n').filter(skill => skill.trim()).map((skill, index) => (
                    <li key={index}>{skill.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    
    template3: () => (
      <div className="flex max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden font-sans">
        <div className="w-1/3 bg-indigo-800 text-white p-6">
          {profileImage && (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-2 border-white"
            />
          )}
          
          <h1 className="text-2xl font-bold text-center mb-2">
            {cvData.firstName} {cvData.lastName}
          </h1>
          <h2 className="text-lg text-center mb-8 text-indigo-200">{cvData.title}</h2>
          
          {(cvData.email || cvData.phone || cvData.address) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b border-indigo-700 pb-1 mb-3">CONTACT</h3>
              <div className="space-y-2 text-sm">
                {cvData.email && <div><i className="fas fa-envelope mr-2"></i> {cvData.email}</div>}
                {cvData.phone && <div><i className="fas fa-phone mr-2"></i> {cvData.phone}</div>}
                {cvData.address && <div><i className="fas fa-map-marker-alt mr-2"></i> {cvData.address}</div>}
              </div>
            </div>
          )}
          
          {cvData.skills && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b border-indigo-700 pb-1 mb-3">COMPÉTENCES</h3>
              <div className="space-y-2">
                {cvData.skills.split('\n').filter(skill => skill.trim()).map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>{skill.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="w-2/3 p-8">
          {cvData.experience && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-800 border-b-2 border-indigo-200 pb-1 mb-3">EXPÉRIENCE PROFESSIONNELLE</h3>
              <p className="text-gray-700 whitespace-pre-line">{cvData.experience}</p>
            </div>
          )}
          
          {cvData.education && (
            <div>
              <h3 className="text-xl font-semibold text-indigo-800 border-b-2 border-indigo-200 pb-1 mb-3">FORMATION</h3>
              <p className="text-gray-700 whitespace-pre-line">{cvData.education}</p>
            </div>
          )}
        </div>
      </div>
    ),
    
    template4: () => (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto font-sans">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {cvData.firstName} <span className="text-purple-600">{cvData.lastName}</span>
            </h1>
            <h2 className="text-2xl text-gray-600 mt-1">{cvData.title}</h2>
            
            {(cvData.email || cvData.phone || cvData.address) && (
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                {cvData.email && <div><i className="fas fa-envelope mr-2"></i> {cvData.email}</div>}
                {cvData.phone && <div><i className="fas fa-phone mr-2"></i> {cvData.phone}</div>}
                {cvData.address && <div><i className="fas fa-map-marker-alt mr-2"></i> {cvData.address}</div>}
              </div>
            )}
          </div>
          
          {profileImage && (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-2 border-purple-100 shadow-sm"
            />
          )}
        </div>
        
        <div className="space-y-8">
          {cvData.experience && (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-1 bg-purple-600 mr-4"></div>
                <h3 className="text-xl font-semibold text-gray-800">Expérience Professionnelle</h3>
              </div>
              <p className="text-gray-700 ml-14 whitespace-pre-line">{cvData.experience}</p>
            </div>
          )}
          
          {cvData.education && (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-1 bg-purple-600 mr-4"></div>
                <h3 className="text-xl font-semibold text-gray-800">Formation</h3>
              </div>
              <p className="text-gray-700 ml-14 whitespace-pre-line">{cvData.education}</p>
            </div>
          )}
          
          {cvData.skills && (
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-1 bg-purple-600 mr-4"></div>
                <h3 className="text-xl font-semibold text-gray-800">Compétences Techniques</h3>
              </div>
              <div className="ml-14 grid grid-cols-2 gap-2">
                {cvData.skills.split('\n').filter(skill => skill.trim()).map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                    <span className="text-gray-700">{skill.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    
    template5: () => (
      <div className="bg-gray-50 p-8 rounded-lg max-w-2xl mx-auto font-sans">
        <div className="bg-white p-8 rounded shadow-lg">
          <div className="flex flex-col md:flex-row items-center mb-8">
            {profileImage && (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-28 h-28 rounded-full object-cover mb-4 md:mb-0 md:mr-6 border-4 border-white shadow-md"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">
                {cvData.firstName} {cvData.lastName}
              </h1>
              <h2 className="text-xl text-emerald-600 mt-1">{cvData.title}</h2>
              
              {(cvData.email || cvData.phone || cvData.address) && (
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  {cvData.email && <div><i className="fas fa-envelope mr-1"></i> {cvData.email}</div>}
                  {cvData.phone && <div><i className="fas fa-phone mr-1"></i> {cvData.phone}</div>}
                  {cvData.address && <div><i className="fas fa-map-marker-alt mr-1"></i> {cvData.address}</div>}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            {cvData.experience && (
              <div>
                <h3 className="text-xl font-semibold text-emerald-600 border-b border-emerald-100 pb-2 mb-3">Expérience</h3>
                <div className="pl-4 border-l-2 border-emerald-100">
                  <p className="text-gray-700 whitespace-pre-line">{cvData.experience}</p>
                </div>
              </div>
            )}
            
            {cvData.education && (
              <div>
                <h3 className="text-xl font-semibold text-emerald-600 border-b border-emerald-100 pb-2 mb-3">Formation</h3>
                <div className="pl-4 border-l-2 border-emerald-100">
                  <p className="text-gray-700 whitespace-pre-line">{cvData.education}</p>
                </div>
              </div>
            )}
            
            {cvData.skills && (
              <div>
                <h3 className="text-xl font-semibold text-emerald-600 border-b border-emerald-100 pb-2 mb-3">Compétences</h3>
                <div className="pl-4">
                  <div className="grid grid-cols-2 gap-2">
                    {cvData.skills.split('\n').filter(skill => skill.trim()).map((skill, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{skill.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Générateur de CV Professionnel</h1>
          <p className="text-lg text-gray-600">Créez votre CV en ligne et exportez-le en PDF</p>
        </header>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire de saisie */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Informations Personnelles</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={cvData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={cvData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dupont"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre Professionnel *</label>
                  <input
                    type="text"
                    name="title"
                    value={cvData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Développeur Full Stack"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={cvData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jean.dupont@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={cvData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="address"
                    value={cvData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paris, France"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expérience Professionnelle</label>
                  <textarea
                    name="experience"
                    value={cvData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Décrivez votre expérience professionnelle..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">Utilisez des puces (•) pour les listes</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                  <textarea
                    name="education"
                    value={cvData.education}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Listez vos formations et diplômes..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
                  <textarea
                    name="skills"
                    value={cvData.skills}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Listez vos compétences techniques et professionnelles..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">Une compétence par ligne</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo de Profil</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={triggerFileInput}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      <i className="fas fa-upload mr-2"></i>
                      {profileImage ? 'Changer la photo' : 'Ajouter une photo'}
                    </button>
                    {profileImage && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format recommandé : carré ou portrait</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Prévisualisation du CV */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Modèles de CV</h2>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={`template${num}`}
                    onClick={() => setSelectedTemplate(`template${num}`)}
                    className={`p-2 rounded-lg border transition-all ${selectedTemplate === `template${num}` 
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' 
                      : 'bg-gray-50 border-gray-300 hover:border-blue-300'}`}
                  >
                    <div className={`h-12 rounded-md bg-gradient-to-br ${
                      num === 1 ? 'from-blue-100 to-blue-200' :
                      num === 2 ? 'from-teal-100 to-teal-200' :
                      num === 3 ? 'from-indigo-100 to-indigo-200' :
                      num === 4 ? 'from-purple-100 to-purple-200' :
                      'from-emerald-100 to-emerald-200'
                    }`}></div>
                    <div className="mt-2 text-sm font-medium text-gray-700">Modèle {num}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleExportPDF}
                disabled={isGeneratingPDF || !cvData.firstName || !cvData.lastName}
                className={`mt-6 w-full py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
                  isGeneratingPDF || !cvData.firstName || !cvData.lastName
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isGeneratingPDF ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-pdf mr-2"></i>
                    Exporter en PDF
                  </>
                )}
              </button>
              
              {(!cvData.firstName || !cvData.lastName) && (
                <p className="text-sm text-red-500 mt-2">Veuillez remplir les champs obligatoires (Prénom et Nom)</p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Aperçu du CV</h2>
              <div className="border border-gray-200 rounded-lg p-4 overflow-auto">
                <div ref={cvPreviewRef} className="scale-90 md:scale-100 origin-top">
                  {templates[selectedTemplate]()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthorInfo />
    </div>
  );
};

export default App;